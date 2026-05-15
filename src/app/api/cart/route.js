import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { LK_TOKEN_COOKIE } from '@/lib/lk-auth-cookie';
import { applyClearLkAuthCookies } from '@/lib/lk-sso';
import {
  readCartFromCookieStore,
  CART_COOKIE_NAME,
  cartCookieSetOptions,
} from '@/lib/cart-cookie';
import {
  fetchLkCart,
  normalizeLkCartToSiteRows,
  findLkCartLineIdForProduct,
  clearLkCart,
  postLkCartItem,
  putLkCartItemQuantity,
  deleteLkCartItem,
  unwrapLkCartPayload,
  verifyLkBearerActive,
} from '@/lib/lk-client-cart';

/**
 * Корзина только для пользователя с валидной SSO-cookie: данные с ЛК
 * ([документация](https://lk.truck-import.ru/api/documentation): `GET/DELETE /api/v1/client/cart`,
 * `POST .../cart/items`, `PUT/DELETE .../items/{id}`).
 * Гость: GET возвращает пустую корзину и сбрасывает устаревшую cookie `cart`; POST — 401.
 * Строки корзины ЛК приводятся к `{ i }` витрины через тот же каталог, что и карточки товаров
 * (`fetchProductByIdOrSku` в `products-source` — по умолчанию данные с ЛК).
 */

/** Ответ корзины с ЛК: не пишем cookie витрины (гостевая корзина отключается). */
function jsonAuthCartResponse(siteCart) {
  const res = NextResponse.json({ ...siteCart, authenticated: true }, { status: 200 });
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');
  res.cookies.delete(CART_COOKIE_NAME, { path: '/' });
  return res;
}

function errorJson(message, status, code) {
  const res = NextResponse.json({ message, code }, { status });
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');
  return res;
}

function bearerToken(cookieStore) {
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  return typeof raw === 'string' ? raw.trim() : '';
}

/**
 * GET: авторизованный — корзина с ЛК; без входа — пусто и сброс cookie `cart`.
 * POST: только с валидным токеном — мутации в ЛК.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = bearerToken(cookieStore);

  if (token) {
    if (!(await verifyLkBearerActive(token))) {
      const empty = { i: [] };
      const res = NextResponse.json({ ...empty, authenticated: false }, { status: 200 });
      res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
      res.headers.set('Vary', 'Cookie');
      applyClearLkAuthCookies(res);
      res.cookies.set(CART_COOKIE_NAME, JSON.stringify(empty), cartCookieSetOptions());
      return res;
    }
    try {
      const lk = await fetchLkCart(token);
      const site = await normalizeLkCartToSiteRows(lk);
      const res = NextResponse.json({ ...site, authenticated: true }, { status: 200 });
      res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
      res.headers.set('Vary', 'Cookie');
      return res;
    } catch (e) {
      const st = typeof e?.status === 'number' ? e.status : 0;
      if (st === 401 || st === 403) {
        const empty = { i: [] };
        const res = NextResponse.json({ ...empty, authenticated: false }, { status: 200 });
        res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
        res.headers.set('Vary', 'Cookie');
        applyClearLkAuthCookies(res);
        res.cookies.set(CART_COOKIE_NAME, JSON.stringify(empty), cartCookieSetOptions());
        return res;
      }
      const cart = readCartFromCookieStore(cookieStore);
      const res = NextResponse.json({ ...cart, authenticated: false }, { status: 200 });
      res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
      res.headers.set('Vary', 'Cookie');
      return res;
    }
  }

  const empty = { i: [] };
  const res = NextResponse.json({ ...empty, authenticated: false }, { status: 200 });
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');
  res.cookies.set(CART_COOKIE_NAME, JSON.stringify(empty), cartCookieSetOptions());
  return res;
}

async function postAuthenticatedCart(token, body) {
  const action = body?.action;
  const id = body?.productId != null ? String(body.productId) : '';

  try {
    if (action === 'clear') {
      await clearLkCart(token);
      const site = await normalizeLkCartToSiteRows(await fetchLkCart(token));
      return jsonAuthCartResponse(site);
    }

    if (!id) {
      return errorJson('Нужен productId', 400);
    }

    if (action === 'add') {
      const lineId = await findLkCartLineIdForProduct(token, id);
      if (lineId != null) {
        const lk = await fetchLkCart(token);
        const items = unwrapLkCartPayload(lk).items || [];
        const row = items.find((r) => Number(r?.id) === lineId);
        const q = Math.floor(Number(row?.quantity) || 0) + 1;
        await putLkCartItemQuantity(token, lineId, Math.min(999, q));
      } else {
        await postLkCartItem(token, id, 1);
      }
      const site = await normalizeLkCartToSiteRows(await fetchLkCart(token));
      return jsonAuthCartResponse(site);
    }

    if (action === 'remove') {
      const lineId = await findLkCartLineIdForProduct(token, id);
      if (lineId != null) {
        await deleteLkCartItem(token, lineId);
      }
      const site = await normalizeLkCartToSiteRows(await fetchLkCart(token));
      return jsonAuthCartResponse(site);
    }

    if (action === 'set') {
      let qty = Math.floor(Number(body?.quantity) || 0);
      if (qty > 999) qty = 999;
      const lineId = await findLkCartLineIdForProduct(token, id);

      if (qty <= 0) {
        if (lineId != null) {
          await deleteLkCartItem(token, lineId);
        }
      } else if (lineId != null) {
        await putLkCartItemQuantity(token, lineId, qty);
      } else {
        await postLkCartItem(token, id, qty);
      }
      const site = await normalizeLkCartToSiteRows(await fetchLkCart(token));
      return jsonAuthCartResponse(site);
    }

    return errorJson('Неизвестное действие', 400, 'UNKNOWN_ACTION');
  } catch (e) {
    const msg = e.body?.message || e.message || 'Ошибка корзины ЛК';
    const status = typeof e.status === 'number' && e.status >= 400 && e.status < 600 ? e.status : 502;
    const res = errorJson(msg, status, e.body?.code);
    if (status === 401 || status === 403) {
      applyClearLkAuthCookies(res);
    }
    return res;
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const token = bearerToken(cookieStore);
  const auth = Boolean(token);

  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson('Неверный JSON', 400);
  }

  if (auth) {
    if (!(await verifyLkBearerActive(token))) {
      const res = errorJson('Войдите в личный кабинет, чтобы управлять корзиной', 401, 'AUTH_REQUIRED');
      applyClearLkAuthCookies(res);
      return res;
    }
    return postAuthenticatedCart(token, body);
  }

  return errorJson('Войдите в личный кабинет, чтобы управлять корзиной', 401, 'AUTH_REQUIRED');
}
