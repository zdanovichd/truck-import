import { getLkApiBase, LK_TOKEN_COOKIE, lkBearerTokenLooksExpired } from '@/lib/lk-sso';
import { catalogSegmentsReferToSameSku, canonicalCatalogSkuFromSegment } from '@/lib/catalog-sku-keys';
import { fetchProductByIdOrSku, resolveLkProductIdForCartPost } from '@/lib/products-source';
import { readCartFromCookieStore } from '@/lib/cart-cookie';

function cartUrl(path = '') {
  const base = `${getLkApiBase()}/api/v1/client/cart`.replace(/\/$/, '');
  return path ? `${base}/${path.replace(/^\//, '')}` : `${base}`;
}

function authHeaders(token) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.trim()}`,
  };
}

/**
 * Публичная проверка сессии для витрины: `GET /api/v1/auth/status`.
 * Bearer опционален (без заголовка — как правило `{ authenticated: false }`).
 * Ответ 200: `authenticated`, при входе — `user` в формате ЛК (как `/auth/me`).
 * @param {string} [accessToken] — если пусто, запрос без Authorization.
 * @returns {Promise<{ authenticated?: boolean, user?: unknown } & Record<string, unknown>>}
 */
export async function fetchLkAuthStatus(accessToken) {
  const url = `${getLkApiBase()}/api/v1/auth/status`.replace(/\/$/, '');
  const headers = { Accept: 'application/json' };
  const t = typeof accessToken === 'string' ? accessToken.trim() : '';
  if (t) {
    headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(url, { headers, cache: 'no-store' });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || `Auth status: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/** Тело ответа ЛК `auth/status` (плоское или обёртка `data`). */
export function parseLkAuthStatusResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    return { authenticated: false };
  }
  const payload =
    raw.data != null && typeof raw.data === 'object' && !Array.isArray(raw.data)
      ? raw.data
      : raw;
  const authenticated = payload.authenticated === true;
  const user = payload.user;
  if (!authenticated) {
    return { authenticated: false };
  }
  if (user != null && typeof user === 'object') {
    return { authenticated: true, user };
  }
  return { authenticated: true };
}

export function unwrapLkCartPayload(json) {
  if (!json || typeof json !== 'object') return { items: [] };
  if (Array.isArray(json.items)) return json;
  if (json.data && Array.isArray(json.data.items)) return json.data;
  if (Array.isArray(json.data)) return { items: json.data };
  return { items: [] };
}

/**
 * Сырой ответ ЛК GET /api/v1/client/cart.
 * @param {string} accessToken
 */
export async function fetchLkCart(accessToken) {
  const res = await fetch(cartUrl(), {
    headers: authHeaders(accessToken),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || `Корзина ЛК: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * Состояние входа для витрины: `GET …/auth/status` с Bearer.
 * Нет токена / не 200 / `authenticated: false` / ошибка сети → гость (fail-closed для корзины).
 * @param {string} [accessToken]
 * @returns {Promise<{ authenticated: boolean, user?: unknown }>}
 */
export async function resolveVitrineAuthState(accessToken) {
  const t = typeof accessToken === 'string' ? accessToken.trim() : '';
  if (!t) return { authenticated: false };

  try {
    const data = await fetchLkAuthStatus(t);
    return parseLkAuthStatusResponse(data);
  } catch {
    return { authenticated: false };
  }
}

/** @param {string} accessToken */
export async function verifyLkBearerActive(accessToken) {
  const { authenticated } = await resolveVitrineAuthState(accessToken);
  return authenticated;
}

/**
 * Формат витрины `{ i: [[productId, qty], ...] }` из ответа ЛК.
 * Сначала `product_id` из позиции корзины ЛК (если есть), иначе `sku` → товар через
 * `fetchProductByIdOrSku` (тот же источник каталога, что и витрина: при `PRODUCTS_SOURCE=lk` — API ЛК).
 * @param {unknown} lkPayload
 */
export async function normalizeLkCartToSiteRows(lkPayload) {
  const { items } = unwrapLkCartPayload(lkPayload);
  if (!Array.isArray(items)) return { i: [] };

  const rows = [];
  for (const row of items) {
    const qty = Math.floor(Number(row?.quantity) || 0);
    if (qty < 1) continue;

    const sku = String(row?.sku || '').trim();
    if (sku) {
      rows.push([canonicalCatalogSkuFromSegment(sku), qty]);
      continue;
    }

    const directId =
      row?.product_id ??
      row?.product?.id ??
      row?.productId;
    if (directId != null && Number.isFinite(Number(directId))) {
      rows.push([String(Number(directId)), qty]);
    }
  }
  return { i: rows };
}

/**
 * ID строки корзины ЛК для товара с id витрины `productIdStr`.
 * @param {string} accessToken
 * @param {string} productIdStr
 */
export async function findLkCartLineIdForProduct(accessToken, productIdStr) {
  const lk = await fetchLkCart(accessToken);
  const { items } = unwrapLkCartPayload(lk);
  if (!Array.isArray(items)) return null;
  const want = String(productIdStr);

  for (const row of items) {
    const lineId = row?.id;
    if (lineId == null || !Number.isFinite(Number(lineId))) continue;

    const directId =
      row?.product_id ??
      row?.product?.id ??
      row?.productId;
    if (directId != null && String(directId) === want) {
      return Number(lineId);
    }

    const sku = String(row?.sku || '').trim();
    if (sku && catalogSegmentsReferToSameSku(sku, want)) {
      return Number(lineId);
    }
    if (!sku) continue;
    const product = await fetchProductByIdOrSku(sku);
    if (
      product &&
      (String(product.id) === want ||
        catalogSegmentsReferToSameSku(product.sku, want))
    ) {
      return Number(lineId);
    }
  }
  return null;
}

/**
 * @param {string} accessToken
 */
export async function clearLkCart(accessToken) {
  const res = await fetch(cartUrl(), {
    method: 'DELETE',
    headers: authHeaders(accessToken),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || `Очистка корзины ЛК: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * @param {string} accessToken
 * @param {string|number} productIdOrSku id витрины или sku (реальный product_id для ЛК подставляется после резолва каталога)
 * @param {number} quantity
 */
export async function postLkCartItem(accessToken, productIdOrSku, quantity) {
  const lkPid = await resolveLkProductIdForCartPost(productIdOrSku);
  if (lkPid == null) {
    const err = new Error('Товар не найден в каталоге ЛК для добавления в корзину.');
    err.status = 422;
    err.body = { code: 'LK_PRODUCT_NOT_RESOLVED' };
    throw err;
  }
  const res = await fetch(cartUrl('items'), {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({
      product_id: lkPid,
      quantity: Math.min(999, Math.max(1, Math.floor(quantity))),
    }),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || `Добавление в корзину ЛК: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * @param {string} accessToken
 * @param {number} lineId
 * @param {number} quantity
 */
export async function putLkCartItemQuantity(accessToken, lineId, quantity) {
  const res = await fetch(cartUrl(`items/${encodeURIComponent(String(lineId))}`), {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify({
      quantity: Math.min(999, Math.max(1, Math.floor(quantity))),
    }),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || `Обновление корзины ЛК: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * @param {string} accessToken
 * @param {number} lineId
 */
export async function deleteLkCartItem(accessToken, lineId) {
  const res = await fetch(cartUrl(`items/${encodeURIComponent(String(lineId))}`), {
    method: 'DELETE',
    headers: authHeaders(accessToken),
    cache: 'no-store',
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.message || `Удаление из корзины ЛК: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function getCartForOrder(cookieStore) {
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  if (token && !lkBearerTokenLooksExpired(token)) {
    try {
      const lk = await fetchLkCart(token);
      return await normalizeLkCartToSiteRows(lk);
    } catch {
      return { i: [] };
    }
  }
  return readCartFromCookieStore(cookieStore);
}
