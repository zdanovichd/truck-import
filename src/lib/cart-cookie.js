import { LK_TOKEN_COOKIE, lkBearerTokenLooksExpired } from '@/lib/lk-auth-cookie';

export const CART_COOKIE_NAME = 'cart';

const CART_MAX_AGE = 60 * 60 * 24 * 7;

export function cartCookieSetOptions() {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: CART_MAX_AGE,
  };
}

/** @returns {{ i: [string|number, number][] }} */
export function readCartFromCookieStore(cookieStore) {
  const raw = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (!raw) return { i: [] };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.i)) return { i: [] };
    return { i: parsed.i };
  } catch {
    return { i: [] };
  }
}

export function writeCartToCookieStore(cookieStore, cart) {
  cookieStore.set({
    name: CART_COOKIE_NAME,
    value: JSON.stringify(cart),
    ...cartCookieSetOptions(),
  });
}

export function isSiteAuthenticated(cookieStore) {
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  return Boolean(token && !lkBearerTokenLooksExpired(token));
}
