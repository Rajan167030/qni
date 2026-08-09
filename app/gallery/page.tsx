import fs from 'fs/promises';
import path from 'path';
import GalleryPageClient from './GalleryPageClient';

// Server component – auto detects local images from public folders
export default async function GalleryPage() {
  const detectedImages: string[] = [];

  const foldersToScan = [
    { dir: 'gallery', prefix: '/gallery/' },
    { dir: 'speakers', prefix: '/speakers/' },
    { dir: 'our speaker from', prefix: '/our speaker from/' },
  ];

  for (const { dir, prefix } of foldersToScan) {
    const fullPath = path.join(process.cwd(), 'public', dir);
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const validFiles = entries
        .filter((e) => e.isFile() && /\.(png|jpe?g|gif|webp)$/i.test(e.name))
        .map((e) => `${prefix}${e.name}`);
      detectedImages.push(...validFiles);
    } catch (e) {
      // Directory optional
    }
  }

  return <GalleryPageClient detectedImages={detectedImages} />;
}
