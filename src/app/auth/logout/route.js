import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LK_TOKEN_COOKIE, SSO_STATE_COOKIE, getRequestOrigin, getLkApiBase } from '@/lib/lk-sso';

/** Разрешённый относительный URL после выхода (защита от open redirect). */
function safeNextPath(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return '/catalog';
  const t = raw.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return '/catalog';
  if (t.startsWith('/auth/')) return '/catalog';
  return t;
}

/**
 * Выход с витрины: `POST /api/v1/auth/logout` в ЛК (отзыв всех personal access tokens),
 * затем удаление `ti_lk_token` и редирект.
 * `?next=/catalog` — куда вернуть (только доверенные пути).
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  const siteBase = getRequestOrigin(request) || new URL(request.url).origin.replace(/\/$/, '');
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));

  if (token) {
    try {
      await fetch(`${getLkApiBase()}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });
    } catch {
      /* сеть — cookie на витрине всё равно удаляем */
    }
  }

  const res = NextResponse.redirect(`${siteBase}${nextPath}`, 302);
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');
  res.cookies.delete(LK_TOKEN_COOKIE, { path: '/' });
  res.cookies.delete(SSO_STATE_COOKIE, { path: '/' });
  return res;
}
