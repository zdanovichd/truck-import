import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LK_TOKEN_COOKIE, getLkApiBase } from '@/lib/lk-sso';

function getPublicSiteBase(fallbackOrigin) {
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  return fallbackOrigin;
}

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

  const publicBase = getPublicSiteBase(request.nextUrl.origin);
  const sso = new URL('/auth/sso', publicBase);
  return NextResponse.redirect(sso);
}
