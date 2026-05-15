import { NextResponse } from 'next/server';
import { getLkAdminOrderUrl } from '@/lib/lk-site-order';

function noStoreRedirect(url) {
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  return res;
}

/**
 * Редирект на карточку заказа в админке ЛК (id из успешного оформления на витрине).
 */
export async function GET(request) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id || !/^[\w.-]{1,64}$/.test(id)) {
    return noStoreRedirect(new URL('/cart', request.url).toString());
  }
  return noStoreRedirect(getLkAdminOrderUrl(id));
}
