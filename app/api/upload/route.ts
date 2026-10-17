import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getBlogSession, hasAdminSession } from '@/lib/blog-auth';
import { recordWriterActivity, extractClientInfo } from '@/lib/writer-activity';
import { IMAGE_RULES } from '@/lib/blog-content';
import { sniffImage } from '@/lib/image-sniff';

const MB = 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await getBlogSession();
    const isAdmin = await hasAdminSession();
    if (!session && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Writer or admin authentication required.' }, { status: 401 });
    }
    const { ip, userAgent } = extractClientInfo(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const hasCloudinary = Boolean(cloudName && ((apiKey && apiSecret) || uploadPreset));
    const maxBytes = hasCloudinary ? IMAGE_RULES.maxBytes : IMAGE_RULES.maxInlineBytes;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          success: false,
          error: `Image is ${(file.size / MB).toFixed(1)} MB; the limit is ${maxBytes / MB} MB${hasCloudinary ? '' : ' while Cloudinary is not configured'}.`,
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sniffed = sniffImage(buffer);
    if (!sniffed) {
      return NextResponse.json(
        { success: false, error: `Unsupported image format. Allowed: ${IMAGE_RULES.extensions} (SVG is not accepted).` },
        { status: 415 }
      );
    }
    const { mime, width, height } = sniffed;
    if (width && height) {
      if (width > IMAGE_RULES.maxDimension || height > IMAGE_RULES.maxDimension) {
        return NextResponse.json(
          { success: false, error: `Image is ${width}×${height}px; maximum is ${IMAGE_RULES.maxDimension}px on each side.` },
          { status: 400 }
        );
      }
      if (width < IMAGE_RULES.minWidth) {
        return NextResponse.json(
          { success: false, error: `Image is ${width}px wide; minimum width is ${IMAGE_RULES.minWidth}px.` },
          { status: 400 }
        );
      }
    }
    const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;

    // If Cloudinary credentials are configured
    if (hasCloudinary) {
      const cloudinaryFormData = new FormData();
      const blob = new Blob([buffer], { type: mime });
      cloudinaryFormData.append('file', blob, file.name);

      if (apiKey && apiSecret) {
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const folder = 'qnexus';
        
        // Generate SHA-1 signature
        const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

        cloudinaryFormData.append('api_key', apiKey);
        cloudinaryFormData.append('timestamp', timestamp);
        cloudinaryFormData.append('folder', folder);
        cloudinaryFormData.append('signature', signature);
      } else if (uploadPreset) {
        cloudinaryFormData.append('upload_preset', uploadPreset);
      }

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      const data = await res.json();
      if (session) {
        await recordWriterActivity({
          writerEmail: session.email,
          writerName: session.name,
          action: 'IMAGE_UPLOAD',
          actionLabel: `Uploaded image: "${file.name}"`,
          details: { fileName: file.name, fileSize: file.size, fileType: file.type, url: data.secure_url || 'Embedded data URL' },
          ip,
          userAgent,
        });
      }

      if (data.secure_url) {
        return NextResponse.json({
          success: true,
          url: data.secure_url,
          public_id: data.public_id,
          width: data.width ?? width,
          height: data.height ?? height,
        });
      } else {
        console.error('Cloudinary upload error response:', data);
        // If Cloudinary returned an error, fall back to a data URL, but only
        // for files small enough to be stored inline in the post.
        if (file.size > IMAGE_RULES.maxInlineBytes) {
          return NextResponse.json(
            { success: false, error: data.error?.message || 'Cloudinary upload failed.' },
            { status: 502 }
          );
        }
        return NextResponse.json({
          success: true,
          url: dataUrl,
          width,
          height,
          warning: data.error?.message || 'Cloudinary error, fallback to data URL',
        });
      }
    }

    // Fallback if Cloudinary credentials are not set yet
    if (session) {
      await recordWriterActivity({
        writerEmail: session.email,
        writerName: session.name,
        action: 'IMAGE_UPLOAD',
        actionLabel: `Uploaded image: "${file.name}"`,
        details: { fileName: file.name, fileSize: file.size, fileType: file.type },
        ip,
        userAgent,
      });
    }
    return NextResponse.json({
      success: true,
      url: dataUrl,
      width,
      height,
      note: 'Cloudinary not configured yet, image encoded as base64. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local',
    });
  } catch (error: any) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal upload error' },
      { status: 500 }
    );
  }
}
