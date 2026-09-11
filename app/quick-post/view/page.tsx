import type { Metadata } from 'next';

interface ViewParams {
  searchParams: Promise<{ text?: string; image?: string }>;
}

export async function generateMetadata({ searchParams }: ViewParams): Promise<Metadata> {
  const { text, image } = await searchParams;
  const title = (text || 'Shared post').slice(0, 70);
  const description = text || '';

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function QuickPostViewPage({ searchParams }: ViewParams) {
  const { text, image } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-black/10 shadow-xl overflow-hidden">
        {image && (
          <div className="w-full bg-black/5 flex items-center justify-center">
            <img src={image} alt="" className="w-full h-auto max-h-[420px] object-contain" />
          </div>
        )}
        <div className="p-6">
          <p className="text-[15px] leading-relaxed text-[#1e293b] whitespace-pre-line">{text}</p>
        </div>
      </div>
    </main>
  );
}
