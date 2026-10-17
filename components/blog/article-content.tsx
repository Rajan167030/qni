'use client';

import { useMemo, type ComponentProps, type ReactNode } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime';
import 'katex/dist/katex.min.css';
import { renderArticleTree } from '@/lib/blog-markdown';
import { isSafeImageSrc, normalizeDoi, type BlogImage, type BlogReference } from '@/lib/blog-content';

interface ArticleContentProps {
  content: string;
  images?: BlogImage[];
  references?: BlogReference[];
  furtherReading?: BlogReference[];
  showToc?: boolean;
}

function isExternal(href?: string) {
  return !!href && /^https?:\/\//i.test(href);
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function referenceTooltip(ref: BlogReference) {
  return [ref.authors, ref.title, ref.year].filter(Boolean).join(' — ');
}

function HeadingAnchor({ level, id, children }: { level: 2 | 3 | 4 | 5 | 6; id?: string; children: ReactNode }) {
  const Tag = `h${level}` as const;
  const sizes = {
    2: 'text-2xl lg:text-3xl pt-8 pb-2 border-b border-foreground/10',
    3: 'text-xl lg:text-2xl pt-6',
    4: 'text-lg lg:text-xl pt-4',
    5: 'text-base font-semibold pt-2',
    6: 'text-sm font-semibold uppercase tracking-wider pt-2',
  };
  return (
    <Tag id={id} className={`group scroll-mt-28 font-display text-foreground ${sizes[level]}`}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 no-underline"
        >
          #
        </a>
      )}
    </Tag>
  );
}

function ImageCredit({ image }: { image: BlogImage }) {
  const credit = image.credit;
  if (!credit) return null;
  const parts: ReactNode[] = [];
  if (credit.creator) parts.push(<span key="creator">Image: {credit.creator}</span>);
  if (credit.source || credit.sourceUrl) {
    const label = credit.source || hostname(credit.sourceUrl!);
    parts.push(
      <span key="source">
        Source: {credit.sourceUrl ? <ExternalLink href={credit.sourceUrl} className="underline underline-offset-2">{label}</ExternalLink> : label}
      </span>
    );
  }
  if (credit.license || credit.licenseUrl) {
    const label = credit.license || 'License';
    parts.push(
      <span key="license">
        License: {credit.licenseUrl ? <ExternalLink href={credit.licenseUrl} className="underline underline-offset-2">{label}</ExternalLink> : label}
      </span>
    );
  }
  if (parts.length === 0) return null;
  return (
    <span className="block mt-1 text-xs text-muted-foreground/80">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && ' · '}
          {part}
        </span>
      ))}
    </span>
  );
}

function Figure({ image, number }: { image: BlogImage; number: number }) {
  if (!isSafeImageSrc(image.url)) return null;
  const hasCaption = Boolean(image.caption?.trim());
  const hasCredit = Boolean(image.credit && Object.values(image.credit).some(Boolean));
  return (
    <figure id={`figure-${number}`} className="my-10 scroll-mt-28">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="w-full h-auto rounded-2xl border border-foreground/10 bg-foreground/5"
      />
      {(hasCaption || hasCredit) && (
        <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {hasCaption && (
            <>
              <span className="font-mono text-xs uppercase tracking-wider text-foreground/80 mr-2">Figure {number}.</span>
              {image.caption}
            </>
          )}
          <ImageCredit image={image} />
        </figcaption>
      )}
    </figure>
  );
}

function ReferenceBody({ reference }: { reference: BlogReference }) {
  const doi = normalizeDoi(reference.doi);
  return (
    <>
      {reference.authors && <span>{reference.authors}</span>}
      {reference.year && <span> ({reference.year})</span>}
      {(reference.authors || reference.year) && '. '}
      <cite className="italic text-foreground/90">{reference.title}</cite>
      {reference.publisher && <span>. {reference.publisher}</span>}
      {'. '}
      {doi && (
        <ExternalLink href={`https://doi.org/${doi}`} className="underline underline-offset-2 break-all">
          doi:{doi}
        </ExternalLink>
      )}
      {doi && reference.url && ' · '}
      {reference.url && (
        <ExternalLink href={reference.url} className="underline underline-offset-2 break-all">
          {hostname(reference.url)}
        </ExternalLink>
      )}
    </>
  );
}

export function ArticleContent({ content, images = [], references = [], furtherReading = [], showToc = false }: ArticleContentProps) {
  const rendered = useMemo(
    () => renderArticleTree(content || '', references.map(referenceTooltip)),
    [content, references]
  );

  const figureNumbers = useMemo(() => {
    const placed = rendered.placedImageIds.filter((id) => images.some((img) => img.id === id));
    const unplaced = images.filter((img) => !placed.includes(img.id)).map((img) => img.id);
    return new Map([...placed, ...unplaced].map((id, i) => [id, i + 1]));
  }, [rendered.placedImageIds, images]);

  const body = useMemo(() => {
    const components: Partial<Components> = {
      h2: ({ id, children }) => <HeadingAnchor level={2} id={id}>{children}</HeadingAnchor>,
      h3: ({ id, children }) => <HeadingAnchor level={3} id={id}>{children}</HeadingAnchor>,
      h4: ({ id, children }) => <HeadingAnchor level={4} id={id}>{children}</HeadingAnchor>,
      h5: ({ id, children }) => <HeadingAnchor level={5} id={id}>{children}</HeadingAnchor>,
      h6: ({ id, children }) => <HeadingAnchor level={6} id={id}>{children}</HeadingAnchor>,
      p: (props) => <p className="leading-relaxed text-foreground/85" {...props} />,
      a: ({ href, children, className, ...rest }: ComponentProps<'a'>) => {
        if (className === 'citation-link') {
          return (
            <a href={href} className="scroll-mt-28 text-cyan-500 hover:underline no-underline" {...rest}>
              {children}
            </a>
          );
        }
        const style = 'underline underline-offset-2 decoration-foreground/40 hover:decoration-foreground';
        return isExternal(href) ? (
          <ExternalLink href={href!} className={style}>{children}</ExternalLink>
        ) : (
          <a href={href} className={`${style} ${className ?? ''}`} {...rest}>{children}</a>
        );
      },
      ul: ({ className, ...props }) => <ul className={`list-disc pl-6 space-y-2 ${className ?? ''}`} {...props} />,
      ol: ({ className, ...props }) => <ol className={`list-decimal pl-6 space-y-2 ${className ?? ''}`} {...props} />,
      blockquote: (props) => (
        <blockquote className="p-6 rounded-2xl bg-foreground/5 border-l-4 border-foreground italic text-foreground font-serif" {...props} />
      ),
      pre: (props) => (
        <pre className="p-5 rounded-2xl bg-foreground/90 text-background font-mono text-sm overflow-x-auto [&_code]:bg-transparent [&_code]:p-0" {...props} />
      ),
      code: ({ className, ...props }) => (
        <code className={`font-mono text-[0.9em] rounded bg-foreground/10 px-1.5 py-0.5 ${className ?? ''}`} {...props} />
      ),
      table: (props) => (
        <div className="overflow-x-auto border border-foreground/10 rounded-2xl">
          <table className="w-full text-left text-sm" {...props} />
        </div>
      ),
      th: (props) => <th className="p-3 bg-foreground/10 font-semibold" {...props} />,
      td: (props) => <td className="p-3 border-t border-foreground/10" {...props} />,
      hr: () => <hr className="border-foreground/10 my-10" />,
      img: ({ src, alt }) =>
        typeof src === 'string' && isSafeImageSrc(src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? ''} loading="lazy" className="w-full h-auto rounded-2xl border border-foreground/10" />
        ) : null,
      figure: (props: ComponentProps<'figure'> & { 'data-image-id'?: string }) => {
        const id = props['data-image-id'];
        if (!id) return <figure {...props} />;
        const image = images.find((img) => img.id === id);
        return image ? <Figure image={image} number={figureNumbers.get(id)!} /> : null;
      },
    };
    return toJsxRuntime(rendered.tree, { Fragment, jsx, jsxs, components, passKeys: true });
  }, [rendered.tree, images, figureNumbers]);

  const unplacedImages = images.filter((img) => !rendered.placedImageIds.includes(img.id));
  const tocItems = rendered.headings;

  return (
    <div className="space-y-6 text-base lg:text-lg">
      {showToc && tocItems.length >= 3 && (
        <nav aria-label="On this page" className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.03] text-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">On this page</div>
          <ol className="space-y-1.5">
            {tocItems.map((h) => (
              <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground hover:underline">
                  {h.text}
                </a>
              </li>
            ))}
            {references.length > 0 && (
              <li>
                <a href="#article-references" className="text-muted-foreground hover:text-foreground hover:underline">References</a>
              </li>
            )}
          </ol>
        </nav>
      )}

      <div className="article-body space-y-6 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-2">{body}</div>

      {unplacedImages.map((image) => (
        <Figure key={image.id} image={image} number={figureNumbers.get(image.id)!} />
      ))}

      {references.length > 0 && (
        <section id="article-references" aria-labelledby="references-heading" className="scroll-mt-28 pt-10 mt-10 border-t border-foreground/10">
          <h2 id="references-heading" className="text-2xl font-display mb-5">References</h2>
          <ol className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {references.map((reference, i) => {
              const n = i + 1;
              const backLinks = rendered.citations.get(n) ?? [];
              return (
                <li key={reference.id} id={`ref-${n}`} className="scroll-mt-28 flex gap-3 target:bg-cyan-500/10 rounded-lg -mx-2 px-2 py-1">
                  <span className="font-mono text-foreground shrink-0">[{n}]</span>
                  <span>
                    <ReferenceBody reference={reference} />
                    {backLinks.length === 1 && (
                      <a href={`#${backLinks[0]}`} className="ml-2 text-cyan-500 hover:underline" aria-label={`Back to citation ${n} in text`}>
                        ↩ Back to citation
                      </a>
                    )}
                    {backLinks.length > 1 && (
                      <span className="ml-2">
                        ↩ Back to citation{' '}
                        {backLinks.map((citeId, k) => (
                          <a
                            key={citeId}
                            href={`#${citeId}`}
                            className="mr-1 text-cyan-500 hover:underline"
                            aria-label={`Back to citation ${n}, occurrence ${k + 1}`}
                          >
                            {String.fromCharCode(97 + (k % 26))}
                          </a>
                        ))}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {furtherReading.length > 0 && (
        <section id="article-further-reading" aria-labelledby="further-reading-heading" className="scroll-mt-28 pt-8 mt-8 border-t border-foreground/10">
          <h2 id="further-reading-heading" className="text-xl font-display mb-1">Further reading</h2>
          <p className="text-xs text-muted-foreground mb-4">Optional background material. Not cited in the text above.</p>
          <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            {furtherReading.map((reference) => (
              <li key={reference.id}>
                <ReferenceBody reference={reference} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
