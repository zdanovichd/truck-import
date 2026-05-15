import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LK_TOKEN_COOKIE, getRequestOrigin, lkBearerTokenLooksExpired } from '@/lib/lk-sso';
import {
  postLkClientSiteOrder,
  formatLkSiteOrderErrorMessage,
  buildOrderItemsFromSiteCart,
} from '@/lib/lk-site-order';
import { CART_COOKIE_NAME, cartCookieSetOptions } from '@/lib/cart-cookie';
import { getCartForOrder, clearLkCart, verifyLkBearerActive } from '@/lib/lk-client-cart';

function noStoreRedirect(url) {
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');
  return res;
}

/**
 * Авторизованный пользователь: заказ из корзины ЛК (или cookie), очистка на витрине и в ЛК.
 */
export async function GET(request) {
  const cookieStore = await cookies();
  const siteBase = getRequestOrigin(request) || new URL(request.url).origin.replace(/\/$/, '');

  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  if (!token || lkBearerTokenLooksExpired(token)) {
    const res = noStoreRedirect(`${siteBase}/auth/sso`);
    if (token) res.cookies.delete(LK_TOKEN_COOKIE, { path: '/' });
    return res;
  }

  if (!(await verifyLkBearerActive(token))) {
    const res = noStoreRedirect(`${siteBase}/auth/sso`);
    res.cookies.delete(LK_TOKEN_COOKIE, { path: '/' });
    return res;
  }

  const cart = await getCartForOrder(cookieStore);
  if (!cart?.i?.length) {
    return noStoreRedirect(`${siteBase}/cart?order_error=${encodeURIComponent('Корзина пуста')}`);
  }

  const items = await buildOrderItemsFromSiteCart(cart);
  if (!items.length) {
    return noStoreRedirect(
      `${siteBase}/cart?order_error=${encodeURIComponent(
        'Не удалось собрать позиции: нужен sku товара из каталога ЛК',
      )}`,
    );
  }

  /** @type {{ items: typeof items; comment?: string }} */
  const body = { items };
  const comment = process.env.LK_SITE_ORDER_COMMENT?.trim();
  if (comment) body.comment = comment;

  const { ok, status, data } = await postLkClientSiteOrder(token, body);
  if (ok && status === 200 && data.success === true && data.order_id != null) {
    const thanks = new URL(`${siteBase}/cart`);
    thanks.searchParams.set('order_thanks', '1');
    thanks.searchParams.set('order_id', String(data.order_id));
    const orderNo = data.order_number ?? data.orderNumber;
    if (orderNo != null && String(orderNo).trim()) {
      thanks.searchParams.set('order_no', String(orderNo).trim());
    }
    const res = noStoreRedirect(thanks.toString());
    try {
      await clearLkCart(token);
    } catch {
      /* корзина на ЛК могла уже быть пустой */
    }
    res.cookies.set(CART_COOKIE_NAME, JSON.stringify({ i: [] }), cartCookieSetOptions());
    return res;
  }

  const msg = formatLkSiteOrderErrorMessage(data);
  return noStoreRedirect(`${siteBase}/cart?order_error=${encodeURIComponent(msg)}`);
}
