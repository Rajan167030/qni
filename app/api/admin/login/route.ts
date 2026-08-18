import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@quantumnexusglobal.org').toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'qng@admin2026';

    const inputEmail = (email || '').toLowerCase().trim();
    const isEmailMatch =
      inputEmail === envAdminEmail ||
      inputEmail === 'admin' ||
      inputEmail === 'quantumnexusglobal.org' ||
      inputEmail === 'admin@quantumnexusglobal.org';

    const isPasswordMatch = password === envAdminPassword;

    if (isEmailMatch && isPasswordMatch) {
      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid admin username / email or password.',
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error in admin auth API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
