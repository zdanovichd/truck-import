import { NextResponse } from 'next/server';
import { hasLkTokenCookieRaw } from '@/lib/lk-auth-cookie';

/**
 * Корзина и оформление — при наличии `ti_lk_token` пропускаем (валидность даёт ЛК `auth/status` в layout/API).
 * Дублируется серверным redirect в `src/app/cart/layout.js` на случай, если корень Turbopack
 * определился неверно и файл в корне репозитория не подхватился.
 */
export function middleware(request) {
  if (hasLkTokenCookieRaw(request.cookies)) {
    return NextResponse.next();
  }

  const u = request.nextUrl.clone();
  u.pathname = '/auth/sso';
  u.search = '';
  u.searchParams.set('next', '/cart');
  return NextResponse.redirect(u);
}

export const config = {
  matcher: ['/cart', '/cart/:path*', '/auth/continue-checkout', '/auth/place-order'],
};
