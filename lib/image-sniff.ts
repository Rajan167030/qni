/**
 * Identifies an image from its leading bytes (never trusting the declared
 * MIME type or extension) and reads its pixel dimensions where the format
 * allows it cheaply.
 */

export interface SniffedImage {
  mime: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif';
  width?: number;
  height?: number;
}

export function sniffImage(buf: Buffer): SniffedImage | null {
  if (buf.length < 16) return null;

  // PNG: 89 50 4E 47, IHDR width/height at 16/20
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { mime: 'image/png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // GIF87a / GIF89a
  if (buf.toString('ascii', 0, 4) === 'GIF8') {
    return { mime: 'image/gif', width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }

  // WebP: RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X' && buf.length >= 30) {
      return { mime: 'image/webp', width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    }
    if (chunk === 'VP8 ' && buf.length >= 30) {
      return { mime: 'image/webp', width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === 'VP8L' && buf.length >= 25) {
      const bits = buf.readUInt32LE(21);
      return { mime: 'image/webp', width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return { mime: 'image/webp' };
  }

  // AVIF: ISO-BMFF "ftyp" box with an avif/avis brand
  if (buf.toString('ascii', 4, 8) === 'ftyp') {
    const brands = buf.toString('ascii', 8, Math.min(buf.length, 64));
    if (brands.includes('avif') || brands.includes('avis')) return { mime: 'image/avif' };
    return null;
  }

  // JPEG: FF D8, then walk segments to the first SOFn marker
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof) {
        return { mime: 'image/jpeg', height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
    return { mime: 'image/jpeg' };
  }

  return null;
}
