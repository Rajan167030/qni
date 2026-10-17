/**
 * Blog content model, limits and validation shared by the editors, the API
 * and the article renderer. Kept free of browser/server-only imports.
 *
 * Authoring rules are documented in docs/blog-authoring-guide.md.
 */

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  affiliation?: string;
}

export interface BlogImageCredit {
  creator?: string;
  source?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
}

export interface BlogImage {
  /** Stable id used by the `[[image:<id>]]` placement marker. */
  id: string;
  url: string;
  alt: string;
  caption?: string;
  credit?: BlogImageCredit;
  width?: number;
  height?: number;
}

export interface BlogReference {
  id: string;
  authors?: string;
  title: string;
  /** Publisher, journal, conference or website name. */
  publisher?: string;
  year?: string;
  url?: string;
  doi?: string;
}

/** Fields added on top of the original post shape. All optional so older posts keep working. */
export interface BlogRichFields {
  authors?: BlogAuthor[];
  images?: BlogImage[];
  references?: BlogReference[];
  furtherReading?: BlogReference[];
  seoTitle?: string;
  seoDescription?: string;
}

export const BLOG_LIMITS = {
  maxImages: 20,
  maxReferences: 200,
  maxFurtherReading: 50,
  maxCoAuthors: 10,
  maxContentChars: 200_000,
  seoTitleMax: 70,
  seoDescriptionMax: 160,
  altTextMax: 250,
  captionMax: 500,
} as const;

export const IMAGE_RULES = {
  mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
  extensions: '.jpg, .jpeg, .png, .webp, .avif, .gif',
  /** Per-file limit when Cloudinary is configured. */
  maxBytes: 5 * 1024 * 1024,
  /** Without Cloudinary the image is stored inline in the post, so keep it small. */
  maxInlineBytes: 1 * 1024 * 1024,
  minWidth: 600,
  maxDimension: 6000,
  recommendedInlineWidth: 1600,
  recommendedCover: '1200 × 630',
} as const;

export const IMAGE_MARKER_RE = /^\[\[image:([A-Za-z0-9_-]{1,40})\]\]$/;
/** `[1]`, `[1, 3]`, `[2-4]`, `[2–4, 7]` */
export const CITATION_RE = /\[(\d{1,3}(?:\s*[-–,]\s*\d{1,3})*)\]/g;

export function createContentId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function imageMarker(id: string) {
  return `[[image:${id}]]`;
}

/** Expands the inside of a citation marker ("1, 3-5") into reference numbers. */
export function parseCitationNumbers(inner: string): number[] | null {
  const numbers: number[] = [];
  for (const part of inner.split(',')) {
    const range = part.split(/[-–]/).map((n) => parseInt(n.trim(), 10));
    if (range.some((n) => !Number.isFinite(n) || n < 1)) return null;
    if (range.length === 1) {
      numbers.push(range[0]);
    } else if (range.length === 2 && range[0] <= range[1] && range[1] - range[0] < 50) {
      for (let n = range[0]; n <= range[1]; n++) numbers.push(n);
    } else {
      return null;
    }
  }
  return numbers;
}

export function normalizeDoi(doi?: string) {
  if (!doi) return '';
  return doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
}

export function isSafeHttpUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

const INLINE_IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp|avif|gif);base64,[A-Za-z0-9+/=]+$/;

export function isSafeImageSrc(value?: string) {
  return isSafeHttpUrl(value) || (!!value && INLINE_IMAGE_DATA_URL.test(value));
}

/**
 * Unicode NFC, LF line endings, and no control characters other than tab/newline.
 * Everything else (symbols, emoji, `$`, `\`, `<`, `#`) is preserved as typed.
 */
export function cleanText(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, maxLength);
}

function cleanLine(value: unknown, maxLength = 300) {
  return cleanText(value, maxLength).replace(/\s+/g, ' ').trim();
}

function cleanUrl(value: unknown) {
  const url = cleanLine(value, 2048);
  return isSafeHttpUrl(url) ? url : '';
}

function cleanReference(raw: any): BlogReference | null {
  if (!raw || typeof raw !== 'object') return null;
  const reference: BlogReference = {
    id: cleanLine(raw.id, 40) || createContentId('ref'),
    title: cleanLine(raw.title, 500),
    authors: cleanLine(raw.authors, 500) || undefined,
    publisher: cleanLine(raw.publisher, 300) || undefined,
    year: cleanLine(raw.year, 20) || undefined,
    url: cleanUrl(raw.url) || undefined,
    doi: normalizeDoi(cleanLine(raw.doi, 200)) || undefined,
  };
  return reference.title || reference.url || reference.doi ? reference : null;
}

export interface NormalizedRichFields {
  fields: Required<Pick<BlogRichFields, 'images' | 'references' | 'furtherReading'>> &
    Pick<BlogRichFields, 'seoTitle' | 'seoDescription'> & { coAuthors: BlogAuthor[] };
  errors: string[];
}

/**
 * Validates the structured parts of a submitted post. Body Markdown is stored
 * as written (only text-normalised); unsafe HTML in it is removed at render time.
 */
export function normalizeRichFields(body: any): NormalizedRichFields {
  const errors: string[] = [];

  const rawImages: any[] = Array.isArray(body?.images) ? body.images : [];
  if (rawImages.length > BLOG_LIMITS.maxImages) {
    errors.push(`An article can contain at most ${BLOG_LIMITS.maxImages} images.`);
  }
  const seenIds = new Set<string>();
  const images: BlogImage[] = [];
  rawImages.slice(0, BLOG_LIMITS.maxImages).forEach((raw, index) => {
    const label = `Image ${index + 1}`;
    let id = cleanLine(raw?.id, 40);
    if (!/^[A-Za-z0-9_-]+$/.test(id) || seenIds.has(id)) id = createContentId('img');
    seenIds.add(id);

    const url = typeof raw?.url === 'string' ? raw.url.trim() : '';
    if (!isSafeImageSrc(url)) {
      errors.push(`${label}: the image URL must be an https:// link or an uploaded file.`);
      return;
    }
    const alt = cleanLine(raw?.alt, BLOG_LIMITS.altTextMax);
    if (!alt) errors.push(`${label}: alt text is required.`);

    const credit: BlogImageCredit = {
      creator: cleanLine(raw?.credit?.creator, 200) || undefined,
      source: cleanLine(raw?.credit?.source, 200) || undefined,
      sourceUrl: cleanUrl(raw?.credit?.sourceUrl) || undefined,
      license: cleanLine(raw?.credit?.license, 120) || undefined,
      licenseUrl: cleanUrl(raw?.credit?.licenseUrl) || undefined,
    };
    const width = Number(raw?.width);
    const height = Number(raw?.height);
    images.push({
      id,
      url,
      alt,
      caption: cleanText(raw?.caption, BLOG_LIMITS.captionMax).trim() || undefined,
      credit: Object.values(credit).some(Boolean) ? credit : undefined,
      width: Number.isFinite(width) && width > 0 ? Math.round(width) : undefined,
      height: Number.isFinite(height) && height > 0 ? Math.round(height) : undefined,
    });
  });

  const rawRefs: any[] = Array.isArray(body?.references) ? body.references : [];
  if (rawRefs.length > BLOG_LIMITS.maxReferences) {
    errors.push(`An article can contain at most ${BLOG_LIMITS.maxReferences} references.`);
  }
  const references = rawRefs
    .slice(0, BLOG_LIMITS.maxReferences)
    .map(cleanReference)
    .filter((r): r is BlogReference => r !== null);

  const furtherReading = (Array.isArray(body?.furtherReading) ? body.furtherReading : [])
    .slice(0, BLOG_LIMITS.maxFurtherReading)
    .map(cleanReference)
    .filter((r: BlogReference | null): r is BlogReference => r !== null);

  const coAuthors: BlogAuthor[] = (Array.isArray(body?.coAuthors) ? body.coAuthors : [])
    .slice(0, BLOG_LIMITS.maxCoAuthors)
    .map((a: any) => ({
      name: cleanLine(a?.name, 120),
      role: cleanLine(a?.role, 120),
      affiliation: cleanLine(a?.affiliation, 200) || undefined,
    }))
    .filter((a: BlogAuthor) => a.name);

  const seoTitle = cleanLine(body?.seoTitle, 500);
  const seoDescription = cleanLine(body?.seoDescription, 1000);
  if (seoTitle.length > BLOG_LIMITS.seoTitleMax) {
    errors.push(`SEO title must be ${BLOG_LIMITS.seoTitleMax} characters or fewer.`);
  }
  if (seoDescription.length > BLOG_LIMITS.seoDescriptionMax) {
    errors.push(`SEO description must be ${BLOG_LIMITS.seoDescriptionMax} characters or fewer.`);
  }

  return {
    fields: {
      images,
      references,
      furtherReading,
      coAuthors,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
    },
    errors,
  };
}

/**
 * Non-blocking authoring checks shown in the editor: markers that point at
 * nothing, images that are never placed, references that are never cited.
 */
export function lintArticle(content: string, images: BlogImage[], references: BlogReference[]) {
  const warnings: string[] = [];
  const prose = stripCodeAndMath(content);

  const placed = new Set<string>();
  for (const line of content.split('\n')) {
    const match = line.trim().match(IMAGE_MARKER_RE);
    if (!match) continue;
    if (!images.some((img) => img.id === match[1])) {
      warnings.push(`${line.trim()} does not match any image in the Images list.`);
    }
    placed.add(match[1]);
  }
  images.forEach((img, i) => {
    if (!placed.has(img.id)) warnings.push(`Image ${i + 1} is not placed in the text; it will appear after the article body.`);
    if (!img.alt.trim()) warnings.push(`Image ${i + 1} is missing alt text.`);
  });

  const cited = new Set<number>();
  for (const match of prose.matchAll(CITATION_RE)) {
    const numbers = parseCitationNumbers(match[1]);
    if (!numbers) continue;
    const missing = numbers.filter((n) => n > references.length);
    if (missing.length) {
      warnings.push(`Citation ${match[0]} points to a reference that does not exist (there are ${references.length}).`);
    }
    numbers.forEach((n) => cited.add(n));
  }
  references.forEach((_, i) => {
    if (!cited.has(i + 1)) warnings.push(`Reference [${i + 1}] is never cited. Move it to Further Reading if it is background material.`);
  });

  return warnings;
}

function stripCodeAndMath(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$\n]+\$/g, '');
}
