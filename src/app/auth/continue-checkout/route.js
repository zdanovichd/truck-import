import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LK_TOKEN_COOKIE, getRequestOrigin, lkBearerTokenLooksExpired } from '@/lib/lk-sso';
import { verifyLkBearerActive } from '@/lib/lk-client-cart';

function noStoreRedirect(url) {
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');
  return res;
}

/**
 * С корзины «Оформить заказ»: без токена → SSO, иначе → /auth/place-order.
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  const base = getRequestOrigin(request) || new URL(request.url).origin.replace(/\/$/, '');
  if (!token || lkBearerTokenLooksExpired(token)) {
    const res = noStoreRedirect(`${base}/auth/sso?next=${encodeURIComponent('/cart')}`);
    if (token) {
      res.cookies.delete(LK_TOKEN_COOKIE, { path: '/' });
    }
    return res;
  }

  if (!(await verifyLkBearerActive(token))) {
    const res = noStoreRedirect(`${base}/auth/sso?next=${encodeURIComponent('/cart')}`);
    res.cookies.delete(LK_TOKEN_COOKIE, { path: '/' });
    return res;
  }

  return noStoreRedirect(`${base}/auth/place-order`);
}
