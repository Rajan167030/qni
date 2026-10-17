'use client';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bold,
  BookMarked,
  Code,
  Eye,
  Hash,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  PenLine,
  Plus,
  Quote,
  Sigma,
  Trash2,
  Upload,
  Users,
  HelpCircle,
  Search,
} from 'lucide-react';
import { ArticleContent } from './article-content';
import {
  BLOG_LIMITS,
  IMAGE_RULES,
  createContentId,
  imageMarker,
  lintArticle,
  type BlogAuthor,
  type BlogImage,
  type BlogReference,
} from '@/lib/blog-content';

export interface RichEditorValue {
  content: string;
  images: BlogImage[];
  references: BlogReference[];
  furtherReading: BlogReference[];
  coAuthors: BlogAuthor[];
  seoTitle: string;
  seoDescription: string;
}

export const emptyRichEditorValue = (): RichEditorValue => ({
  content: '',
  images: [],
  references: [],
  furtherReading: [],
  coAuthors: [],
  seoTitle: '',
  seoDescription: '',
});

export function richEditorValueFromPost(post: {
  content: string;
  images?: BlogImage[];
  references?: BlogReference[];
  furtherReading?: BlogReference[];
  authors?: BlogAuthor[];
  seoTitle?: string;
  seoDescription?: string;
}): RichEditorValue {
  return {
    content: post.content,
    images: post.images ?? [],
    references: post.references ?? [],
    furtherReading: post.furtherReading ?? [],
    coAuthors: (post.authors ?? []).slice(1),
    seoTitle: post.seoTitle ?? '',
    seoDescription: post.seoDescription ?? '',
  };
}

const inputClass =
  'w-full px-3.5 py-2 bg-foreground/5 border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-foreground/30 placeholder:text-muted-foreground/60';
const labelClass = 'text-xs font-mono uppercase text-muted-foreground block mb-1.5';
const smallButton =
  'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-xs text-foreground transition-colors disabled:opacity-40';

async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

/** Client-side pre-check; the upload API re-validates from the file bytes. */
async function uploadBlogImage(file: File): Promise<{ url: string; width?: number; height?: number }> {
  if (!(IMAGE_RULES.mimeTypes as readonly string[]).includes(file.type)) {
    throw new Error(`${file.name}: unsupported format. Use ${IMAGE_RULES.extensions}.`);
  }
  if (file.size > IMAGE_RULES.maxBytes) {
    throw new Error(`${file.name}: ${(file.size / 1024 / 1024).toFixed(1)} MB exceeds the 5 MB limit.`);
  }
  const size = await readImageSize(file);
  if (size && size.width < IMAGE_RULES.minWidth) {
    throw new Error(`${file.name}: ${size.width}px wide; minimum is ${IMAGE_RULES.minWidth}px.`);
  }
  if (size && Math.max(size.width, size.height) > IMAGE_RULES.maxDimension) {
    throw new Error(`${file.name}: ${size.width}×${size.height}px exceeds ${IMAGE_RULES.maxDimension}px.`);
  }

  const data = new FormData();
  data.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: data });
  const result = await res.json().catch(() => ({}));
  if (!res.ok || !result.success || !result.url) {
    throw new Error(`${file.name}: ${result.error || 'upload failed'}`);
  }
  return { url: result.url, width: result.width ?? size?.width, height: result.height ?? size?.height };
}

function move<T>(list: T[], index: number, delta: number) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function Section({ icon, title, hint, children }: { icon: ReactNode; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-foreground/10 p-5 space-y-4">
      <legend className="px-2 text-sm font-display inline-flex items-center gap-2">
        {icon}
        {title}
      </legend>
      {hint && <p className="text-xs text-muted-foreground -mt-2">{hint}</p>}
      {children}
    </fieldset>
  );
}

function ReferenceListEditor({
  items,
  onChange,
  numbered,
  onCite,
}: {
  items: BlogReference[];
  onChange: (items: BlogReference[]) => void;
  numbered: boolean;
  onCite?: (n: number) => void;
}) {
  const update = (index: number, patch: Partial<BlogReference>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((ref, index) => (
        <div key={ref.id} className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-muted-foreground">{numbered ? `[${index + 1}]` : `Item ${index + 1}`}</span>
            <div className="flex items-center gap-1">
              {onCite && (
                <button type="button" className={smallButton} onClick={() => onCite(index + 1)} title="Insert citation marker at cursor">
                  Cite [{index + 1}]
                </button>
              )}
              <button type="button" className={smallButton} disabled={index === 0} onClick={() => onChange(move(items, index, -1))} aria-label="Move up">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button type="button" className={smallButton} disabled={index === items.length - 1} onClick={() => onChange(move(items, index, 1))} aria-label="Move down">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button type="button" className={`${smallButton} text-red-400`} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Remove">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <input className={`${inputClass} sm:col-span-2`} placeholder="Title *" value={ref.title} onChange={(e) => update(index, { title: e.target.value })} />
            <input className={inputClass} placeholder="Author(s), e.g. Preskill, J." value={ref.authors ?? ''} onChange={(e) => update(index, { authors: e.target.value })} />
            <input className={inputClass} placeholder="Publisher / journal / website" value={ref.publisher ?? ''} onChange={(e) => update(index, { publisher: e.target.value })} />
            <input className={inputClass} placeholder="Year" value={ref.year ?? ''} onChange={(e) => update(index, { year: e.target.value })} />
            <input className={inputClass} placeholder="DOI, e.g. 10.22331/q-2018-08-06-79" value={ref.doi ?? ''} onChange={(e) => update(index, { doi: e.target.value })} />
            <input className={`${inputClass} sm:col-span-2`} type="url" placeholder="URL (https://…)" value={ref.url ?? ''} onChange={(e) => update(index, { url: e.target.value })} />
          </div>
        </div>
      ))}
      <button type="button" className={smallButton} onClick={() => onChange([...items, { id: createContentId('ref'), title: '' }])}>
        <Plus className="w-3.5 h-3.5" /> Add {numbered ? 'reference' : 'further-reading item'}
      </button>
    </div>
  );
}

const FORMATTING_GUIDE: [string, string][] = [
  ['**bold**', 'Bold'],
  ['*italic*', 'Italic'],
  ['***bold italic***', 'Bold italic'],
  ['# Section / ## Subsection / ### …', 'Headings (start of line, followed by a space)'],
  ['## Methods {#methods}', 'Heading with a fixed anchor'],
  ['[see Methods](#methods)', 'Link to a section'],
  ['- item  /  1. item', 'Bulleted / numbered list'],
  ['```python … ```', 'Code block'],
  ['`code`', 'Inline code'],
  ['$E = mc^2$', 'Inline equation (KaTeX)'],
  ['$$ … $$', 'Display equation on its own lines'],
  ['\\$5', 'Literal dollar sign'],
  ['[1]  [1, 3]  [2-4]', 'Citation → links to References'],
  ['[[image:img-abc123]]', 'Place an image (own paragraph)'],
  ['> quote', 'Block quote'],
  ['| a | b |', 'Table'],
  ['\\#hashtag  or  #hashtag', 'Literal # (only “# ” at line start is a heading)'],
];

export function RichArticleEditor({
  value,
  onChange,
  title,
  excerpt,
}: {
  value: RichEditorValue;
  onChange: (patch: Partial<RichEditorValue>) => void;
  /** Used as the SEO fallback preview. */
  title: string;
  excerpt: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [showGuide, setShowGuide] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  const warnings = useMemo(
    () => lintArticle(value.content, value.images, value.references),
    [value.content, value.images, value.references]
  );

  const replaceSelection = (build: (selected: string) => string, selectInner?: [number, number]) => {
    const el = textareaRef.current;
    const content = value.content;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    const inserted = build(content.slice(start, end));
    onChange({ content: content.slice(0, start) + inserted + content.slice(end) });
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const [a, b] = selectInner ?? [inserted.length, inserted.length];
      el.setSelectionRange(start + a, start + b);
    });
  };

  const wrap = (before: string, after: string, placeholder: string) => {
    const el = textareaRef.current;
    const selected = el ? value.content.slice(el.selectionStart, el.selectionEnd) : '';
    const inner = selected || placeholder;
    replaceSelection(() => `${before}${inner}${after}`, [before.length, before.length + inner.length]);
  };

  /** Inserts text as its own paragraph (blank lines around it). */
  const insertBlock = (block: string) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.content.length;
    const before = value.content.slice(0, start);
    const after = value.content.slice(el?.selectionEnd ?? start);
    const lead = before.length === 0 || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
    const trail = after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';
    replaceSelection(() => `${lead}${block}${trail}`);
  };

  const prefixLines = (prefix: (i: number) => string) =>
    replaceSelection((selected) =>
      (selected || 'item')
        .split('\n')
        .map((line, i) => `${prefix(i)}${line}`)
        .join('\n')
    );

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = BLOG_LIMITS.maxImages - value.images.length;
    const batch = Array.from(files).slice(0, Math.max(room, 0));
    const errors: string[] = files.length > batch.length ? [`Only ${BLOG_LIMITS.maxImages} images are allowed per article.`] : [];
    setUploading(true);
    const added: BlogImage[] = [];
    for (const file of batch) {
      try {
        const uploaded = await uploadBlogImage(file);
        added.push({ id: createContentId('img'), alt: '', ...uploaded });
      } catch (err: any) {
        errors.push(err.message);
      }
    }
    setUploading(false);
    setUploadErrors(errors);
    if (added.length) onChange({ images: [...value.images, ...added] });
  };

  const addImageByUrl = () => {
    const url = imageUrl.trim();
    if (!/^https:\/\//i.test(url)) {
      setUploadErrors(['Image URLs must start with https://']);
      return;
    }
    onChange({ images: [...value.images, { id: createContentId('img'), url, alt: '' }] });
    setImageUrl('');
    setUploadErrors([]);
  };

  const updateImage = (index: number, patch: Partial<BlogImage>) =>
    onChange({ images: value.images.map((img, i) => (i === index ? { ...img, ...patch } : img)) });

  const updateCredit = (index: number, patch: NonNullable<BlogImage['credit']>) =>
    updateImage(index, { credit: { ...value.images[index].credit, ...patch } });

  const removeImage = (index: number) => {
    const id = value.images[index].id;
    onChange({
      images: value.images.filter((_, i) => i !== index),
      content: value.content
        .split('\n')
        .filter((line) => line.trim() !== imageMarker(id))
        .join('\n'),
    });
  };

  const seoTitle = value.seoTitle || title;
  const seoDescription = value.seoDescription || excerpt;

  return (
    <div className="space-y-6">
      {/* Body */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className={`${labelClass} mb-0`}>Article Body (Markdown) *</label>
          <div className="flex items-center gap-1 rounded-lg bg-foreground/5 p-0.5 text-xs">
            <button type="button" onClick={() => setMode('write')} className={`px-3 py-1 rounded-md inline-flex items-center gap-1 ${mode === 'write' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
              <PenLine className="w-3.5 h-3.5" /> Write
            </button>
            <button type="button" onClick={() => setMode('preview')} className={`px-3 py-1 rounded-md inline-flex items-center gap-1 ${mode === 'preview' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>

        {mode === 'write' ? (
          <>
            <div className="flex flex-wrap gap-1 mb-2" role="toolbar" aria-label="Formatting">
              <button type="button" className={smallButton} onClick={() => wrap('**', '**', 'bold text')} title="Bold"><Bold className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => wrap('*', '*', 'italic text')} title="Italic"><Italic className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => wrap('***', '***', 'bold italic')} title="Bold italic"><Bold className="w-3.5 h-3.5" /><Italic className="w-3.5 h-3.5 -ml-1" /></button>
              <button type="button" className={smallButton} onClick={() => insertBlock('## Section heading')} title="Heading"><Hash className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => prefixLines(() => '- ')} title="Bulleted list"><List className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => prefixLines((i) => `${i + 1}. `)} title="Numbered list"><ListOrdered className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => prefixLines(() => '> ')} title="Quote"><Quote className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => insertBlock('```python\n# code\n```')} title="Code block"><Code className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => wrap('$', '$', 'E = mc^2')} title="Inline equation"><Sigma className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => insertBlock('$$\n\\hat{H}\\lvert\\psi\\rangle = E\\lvert\\psi\\rangle\n$$')} title="Display equation"><Sigma className="w-3.5 h-3.5" />$$</button>
              <button type="button" className={smallButton} onClick={() => wrap('[', '](https://)', 'link text')} title="Link"><Link2 className="w-3.5 h-3.5" /></button>
              <button type="button" className={smallButton} onClick={() => setShowGuide((s) => !s)} title="Formatting guide"><HelpCircle className="w-3.5 h-3.5" /> Guide</button>
            </div>
            {showGuide && (
              <div className="mb-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3 text-xs grid sm:grid-cols-2 gap-x-6 gap-y-1">
                {FORMATTING_GUIDE.map(([syntax, meaning]) => (
                  <div key={syntax} className="flex justify-between gap-3 border-b border-foreground/5 py-1">
                    <code className="font-mono text-foreground">{syntax}</code>
                    <span className="text-muted-foreground text-right">{meaning}</span>
                  </div>
                ))}
                <p className="sm:col-span-2 pt-2 text-muted-foreground">
                  Allowed inline HTML: &lt;sup&gt;, &lt;sub&gt;, &lt;mark&gt;, &lt;kbd&gt;, &lt;abbr title&gt;, &lt;br&gt;, &lt;details&gt;/&lt;summary&gt;. Scripts, styles, iframes, forms and event attributes are removed.
                </p>
              </div>
            )}
            <textarea
              ref={textareaRef}
              rows={16}
              required
              value={value.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder={'## Introduction\n\nWrite with **bold**, *italics* and equations like $E = mc^2$. Cite sources as [1].'}
              className="w-full p-4 bg-foreground/5 border border-foreground/10 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-foreground/30 leading-relaxed"
            />
          </>
        ) : (
          <div className="rounded-xl border border-foreground/10 p-5 max-h-[70vh] overflow-y-auto">
            {value.content.trim() ? (
              <ArticleContent
                content={value.content}
                images={value.images}
                references={value.references}
                furtherReading={value.furtherReading}
                showToc
              />
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        )}

        {warnings.length > 0 && (
          <ul className="mt-3 space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-500">
            {warnings.map((w) => (
              <li key={w} className="flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Images */}
      <Section
        icon={<ImagePlus className="w-4 h-4" />}
        title={`Images (${value.images.length}/${BLOG_LIMITS.maxImages})`}
        hint={`${IMAGE_RULES.extensions} · up to 5 MB each · ${IMAGE_RULES.minWidth}–${IMAGE_RULES.maxDimension}px · ${IMAGE_RULES.recommendedInlineWidth}px wide recommended. Place the cursor in the body, then “Insert at cursor”. Unplaced images appear after the article in this order.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <label className={`${smallButton} cursor-pointer`}>
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading…' : 'Upload images'}
            <input
              type="file"
              accept={IMAGE_RULES.mimeTypes.join(',')}
              multiple
              disabled={uploading || value.images.length >= BLOG_LIMITS.maxImages}
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>
          <input type="url" className={`${inputClass} flex-1 min-w-48`} placeholder="…or paste an https:// image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <button type="button" className={smallButton} onClick={addImageByUrl} disabled={!imageUrl.trim()}>
            <Plus className="w-3.5 h-3.5" /> Add URL
          </button>
        </div>
        {uploadErrors.length > 0 && (
          <ul className="text-xs text-red-400 space-y-0.5">
            {uploadErrors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}

        {value.images.map((image, index) => (
          <div key={image.id} className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3 grid sm:grid-cols-[140px_1fr] gap-3">
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="w-full aspect-video object-cover rounded-lg border border-foreground/10" />
              <code className="block text-[10px] text-muted-foreground break-all">{imageMarker(image.id)}</code>
              {image.width && image.height && <span className="block text-[10px] text-muted-foreground">{image.width}×{image.height}px</span>}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1">
                <button type="button" className={smallButton} onClick={() => { setMode('write'); requestAnimationFrame(() => insertBlock(imageMarker(image.id))); }}>
                  Insert at cursor
                </button>
                <button type="button" className={smallButton} disabled={index === 0} onClick={() => onChange({ images: move(value.images, index, -1) })} aria-label="Move up"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" className={smallButton} disabled={index === value.images.length - 1} onClick={() => onChange({ images: move(value.images, index, 1) })} aria-label="Move down"><ArrowDown className="w-3.5 h-3.5" /></button>
                <button type="button" className={`${smallButton} text-red-400`} onClick={() => removeImage(index)} aria-label="Remove image"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input className={inputClass} maxLength={BLOG_LIMITS.altTextMax} placeholder="Alt text * (describe the image for screen readers)" value={image.alt} onChange={(e) => updateImage(index, { alt: e.target.value })} />
              <textarea className={inputClass} rows={2} maxLength={BLOG_LIMITS.captionMax} placeholder="Caption (optional, shown under the image)" value={image.caption ?? ''} onChange={(e) => updateImage(index, { caption: e.target.value })} />
              <div className="grid sm:grid-cols-2 gap-2">
                <input className={inputClass} placeholder="Creator / photographer" value={image.credit?.creator ?? ''} onChange={(e) => updateCredit(index, { creator: e.target.value })} />
                <input className={inputClass} placeholder="Source name (e.g. IBM Quantum)" value={image.credit?.source ?? ''} onChange={(e) => updateCredit(index, { source: e.target.value })} />
                <input className={inputClass} type="url" placeholder="Source URL" value={image.credit?.sourceUrl ?? ''} onChange={(e) => updateCredit(index, { sourceUrl: e.target.value })} />
                <input className={inputClass} list="blog-license-options" placeholder="License (e.g. CC BY 4.0)" value={image.credit?.license ?? ''} onChange={(e) => updateCredit(index, { license: e.target.value })} />
                <input className={`${inputClass} sm:col-span-2`} type="url" placeholder="License URL" value={image.credit?.licenseUrl ?? ''} onChange={(e) => updateCredit(index, { licenseUrl: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
        <datalist id="blog-license-options">
          <option value="CC BY 4.0" />
          <option value="CC BY-SA 4.0" />
          <option value="CC0 1.0 (Public Domain)" />
          <option value="Public Domain" />
          <option value="Used with permission" />
          <option value="© All rights reserved" />
          <option value="Original work" />
        </datalist>
      </Section>

      {/* References */}
      <Section
        icon={<BookMarked className="w-4 h-4" />}
        title={`References (${value.references.length})`}
        hint="Numbered in this order. Write [1], [1, 3] or [2-4] in the body to cite; the marker links to the reference, and the reference links back."
      >
        <ReferenceListEditor
          items={value.references}
          numbered
          onChange={(references) => onChange({ references })}
          onCite={(n) => {
            setMode('write');
            requestAnimationFrame(() => replaceSelection(() => `[${n}]`));
          }}
        />
      </Section>

      <Section icon={<BookMarked className="w-4 h-4" />} title={`Further Reading (${value.furtherReading.length})`} hint="Optional, unnumbered background material that is not cited in the text.">
        <ReferenceListEditor items={value.furtherReading} numbered={false} onChange={(furtherReading) => onChange({ furtherReading })} />
      </Section>

      {/* Co-authors */}
      <Section icon={<Users className="w-4 h-4" />} title="Co-authors" hint="The signed-in writer is the lead author. Add anyone else who wrote this article.">
        {value.coAuthors.map((author, index) => (
          <div key={index} className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-2">
            <input className={inputClass} placeholder="Name *" value={author.name} onChange={(e) => onChange({ coAuthors: value.coAuthors.map((a, i) => (i === index ? { ...a, name: e.target.value } : a)) })} />
            <input className={inputClass} placeholder="Role" value={author.role} onChange={(e) => onChange({ coAuthors: value.coAuthors.map((a, i) => (i === index ? { ...a, role: e.target.value } : a)) })} />
            <input className={inputClass} placeholder="Affiliation" value={author.affiliation ?? ''} onChange={(e) => onChange({ coAuthors: value.coAuthors.map((a, i) => (i === index ? { ...a, affiliation: e.target.value } : a)) })} />
            <button type="button" className={`${smallButton} text-red-400 justify-center`} onClick={() => onChange({ coAuthors: value.coAuthors.filter((_, i) => i !== index) })} aria-label="Remove co-author">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {value.coAuthors.length < BLOG_LIMITS.maxCoAuthors && (
          <button type="button" className={smallButton} onClick={() => onChange({ coAuthors: [...value.coAuthors, { name: '', role: '' }] })}>
            <Plus className="w-3.5 h-3.5" /> Add co-author
          </button>
        )}
      </Section>

      {/* SEO */}
      <Section icon={<Search className="w-4 h-4" />} title="Search & Social Preview" hint="Leave blank to use the article title and excerpt.">
        <div>
          <label className={labelClass}>
            SEO title <span className={value.seoTitle.length > BLOG_LIMITS.seoTitleMax ? 'text-red-400' : ''}>({value.seoTitle.length}/{BLOG_LIMITS.seoTitleMax})</span>
          </label>
          <input className={inputClass} value={value.seoTitle} placeholder={title} onChange={(e) => onChange({ seoTitle: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>
            SEO description <span className={value.seoDescription.length > BLOG_LIMITS.seoDescriptionMax ? 'text-red-400' : ''}>({value.seoDescription.length}/{BLOG_LIMITS.seoDescriptionMax})</span>
          </label>
          <textarea className={inputClass} rows={2} value={value.seoDescription} placeholder={excerpt} onChange={(e) => onChange({ seoDescription: e.target.value })} />
        </div>
        <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3 text-sm">
          <div className="text-blue-500 truncate">{seoTitle || 'Article title'}</div>
          <div className="text-xs text-emerald-600 truncate">quantumnexusglobal.org › blog</div>
          <div className="text-xs text-muted-foreground line-clamp-2">{seoDescription || 'Article description'}</div>
        </div>
      </Section>
    </div>
  );
}
