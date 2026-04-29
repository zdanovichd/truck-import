import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LK_TOKEN_COOKIE, getLkApiBase } from '@/lib/lk-sso';

/**
 * Есть токен на Next → в личный кабинет (origin из LK_API_BASE_URL).
 * Нет → старт SSO.
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get(LK_TOKEN_COOKIE)?.value);

  if (hasToken) {
    const lk = getLkApiBase();
    return NextResponse.redirect(lk.endsWith('/') ? lk : `${lk}/`);
  }

  const sso = new URL('/auth/sso', request.nextUrl.origin);
  return NextResponse.redirect(sso);
}
