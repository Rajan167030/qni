/**
 * Markdown → sanitized hast pipeline for blog articles.
 *
 * Order matters:
 *   parse (GFM + math) → shift headings → hast → raw HTML → sanitize
 *   → trusted plugins (ids, figures, citations, KaTeX)
 * Everything after `rehypeSanitize` only adds elements we generate ourselves,
 * so author-supplied HTML never gets past the allow-list.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import { visit, SKIP } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import type { Root as HastRoot, Element, ElementContent, Text } from 'hast';
import type { Root as MdastRoot } from 'mdast';
import { CITATION_RE, IMAGE_MARKER_RE, parseCitationNumbers } from './blog-content';

/** HTML that authors may write directly in Markdown. Anything else is dropped. */
export const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [['className', /^language-./, 'math-inline', 'math-display']],
    abbr: ['title'],
  },
};

export interface ArticleHeading {
  id: string;
  text: string;
  level: number;
}

export interface ArticleRenderResult {
  tree: HastRoot;
  headings: ArticleHeading[];
  /** Figure ids in order of first appearance in the text. */
  placedImageIds: string[];
  /** Reference number → ids of every in-text marker pointing at it. */
  citations: Map<number, string[]>;
}

const NON_PROSE = new Set(['a', 'code', 'pre', 'script', 'style', 'math', 'svg']);

/** `#` becomes <h2> because the article title is the page's only <h1>. */
function remarkShiftHeadings() {
  return (tree: MdastRoot) => {
    visit(tree, 'heading', (node) => {
      node.depth = Math.min(node.depth + 1, 6) as typeof node.depth;
    });
  };
}

/**
 * remark-rehype already prefixes footnote ids with `user-content-`, and
 * sanitize prefixes ids again; undo the double prefix so footnote links resolve.
 */
function rehypeFixDoubleClobber() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node) => {
      const id = node.properties?.id;
      if (typeof id === 'string' && id.startsWith('user-content-user-content-')) {
        node.properties.id = id.slice('user-content-'.length);
      }
    });
  };
}

/** `## Methods {#methods}` pins the anchor so it survives heading edits. */
function rehypeExplicitHeadingIds() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      const last = node.children[node.children.length - 1];
      if (!last || last.type !== 'text') return;
      const match = last.value.match(/\s*\{#([A-Za-z][\w-]{0,63})\}\s*$/);
      if (!match) return;
      last.value = last.value.slice(0, match.index);
      node.properties = { ...node.properties, id: match[1].toLowerCase() };
    });
  };
}

function rehypeFigures(options: { placed: string[] }) {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const meaningful = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      if (meaningful.length !== 1 || meaningful[0].type !== 'text') return;
      const match = meaningful[0].value.trim().match(IMAGE_MARKER_RE);
      if (!match) return;
      const id = match[1];
      if (!options.placed.includes(id)) options.placed.push(id);
      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: { dataImageId: id },
        children: [],
      };
      parent.children[index] = figure;
      return SKIP;
    });
  };
}

function rehypeCitations(options: { titles: string[]; occurrences: Map<number, string[]> }) {
  const count = options.titles.length;
  return (tree: HastRoot) => {
    if (count === 0) return;
    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && NON_PROSE.has(node.tagName)) return SKIP;
      if (node.type !== 'text' || !parent || index === undefined) return;

      const text = node as Text;
      const replacement: ElementContent[] = [];
      let cursor = 0;
      for (const match of text.value.matchAll(CITATION_RE)) {
        const numbers = parseCitationNumbers(match[1]);
        if (!numbers || numbers.some((n) => n > count)) continue;

        if (match.index! > cursor) replacement.push({ type: 'text', value: text.value.slice(cursor, match.index) });
        const children: ElementContent[] = [{ type: 'text', value: '[' }];
        numbers.forEach((n, i) => {
          const list = options.occurrences.get(n) ?? [];
          const citeId = `cite-${n}-${list.length + 1}`;
          list.push(citeId);
          options.occurrences.set(n, list);
          if (i > 0) children.push({ type: 'text', value: ', ' });
          children.push({
            type: 'element',
            tagName: 'a',
            properties: {
              href: `#ref-${n}`,
              id: citeId,
              title: options.titles[n - 1],
              className: ['citation-link'],
            },
            children: [{ type: 'text', value: String(n) }],
          });
        });
        children.push({ type: 'text', value: ']' });
        replacement.push({ type: 'element', tagName: 'sup', properties: { className: ['citation'] }, children });
        cursor = match.index! + match[0].length;
      }
      if (replacement.length === 0) return;
      if (cursor < text.value.length) replacement.push({ type: 'text', value: text.value.slice(cursor) });
      parent.children.splice(index, 1, ...replacement);
      return [SKIP, index + replacement.length];
    });
  };
}

function rehypeCollectHeadings(options: { headings: ArticleHeading[] }) {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      const id = node.properties?.id;
      if (typeof id !== 'string' || id === 'footnote-label' || id.endsWith('footnote-label')) return;
      options.headings.push({ id, text: toString(node).trim(), level: Number(node.tagName[1]) });
    });
  };
}

export function renderArticleTree(markdown: string, referenceTitles: string[]): ArticleRenderResult {
  const headings: ArticleHeading[] = [];
  const placed: string[] = [];
  const occurrences = new Map<number, string[]>();

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkShiftHeadings)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeFixDoubleClobber)
    .use(rehypeExplicitHeadingIds)
    .use(rehypeSlug)
    .use(rehypeFigures, { placed })
    .use(rehypeCitations, { titles: referenceTitles, occurrences })
    .use(rehypeCollectHeadings, { headings })
    .use(rehypeKatex, { throwOnError: false, strict: 'ignore' as const, output: 'htmlAndMathml' as const });

  const tree = processor.runSync(processor.parse(markdown)) as HastRoot;
  return { tree, headings, placedImageIds: placed, citations: occurrences };
}
