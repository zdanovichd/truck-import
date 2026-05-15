import { getLkApiBase } from '@/lib/lk-sso';
import { fetchProductByIdOrSku } from '@/lib/products-source';

/**
 * URL карточки заказа в админке ЛК.
 * @param {string|number} orderId
 */
export function getLkAdminOrderUrl(orderId) {
  const base = (process.env.LK_ADMIN_BASE_URL || getLkApiBase()).replace(/\/$/, '');
  return `${base}/admin/orders/${encodeURIComponent(String(orderId))}`;
}

/**
 * Собирает `items` для POST /api/v1/client/orders из cookie корзины `{ i: [[idOrSku, qty], ...] }`.
 * В теле — `sku` (как в products.sku) и `quantity`; дубликаты sku схлопываются по количеству.
 * @param {{ i?: unknown[] }} cart
 * @returns {Promise<Array<{ sku: string; quantity: number }>>}
 */
export async function buildOrderItemsFromSiteCart(cart) {
  /** @type {Map<string, number>} */
  const bySku = new Map();
  for (const row of cart?.i || []) {
    if (!Array.isArray(row) || row.length < 2) continue;
    const [idOrSku, qtyRaw] = row;
    const product = await fetchProductByIdOrSku(String(idOrSku));
    const sku = String(product?.sku ?? '').trim();
    if (!sku) continue;
    let q = Math.floor(Number(qtyRaw) || 1);
    if (q < 1) q = 1;
    if (q > 999) q = 999;
    bySku.set(sku, (bySku.get(sku) || 0) + q);
  }
  const items = [];
  for (const [sku, quantity] of bySku) {
    let q = quantity;
    if (q > 999) q = 999;
    items.push({ sku, quantity: q });
  }
  return items;
}

/**
 * Создание заказа в ЛК (Sanctum). Тело: `{ items: [{ sku, quantity }], comment? }` — заказчик только из Bearer.
 * @param {string} accessToken
 * @param {{ items: Array<{ sku: string; quantity: number }>; comment?: string }} body
 * @returns {Promise<{ ok: boolean; status: number; data: Record<string, unknown> }>}
 */
export async function postLkClientSiteOrder(accessToken, body) {
  const url = `${getLkApiBase()}/api/v1/client/orders`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken.trim()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  return { ok: res.ok, status: res.status, data };
}

/**
 * Тело для POST /api/v1/client/orders из payload витрины (например `POST /api/orders`).
 * Ожидается `cart` — массив объектов товара с полем `sku` (как в каталоге ЛК) и `quantity`.
 * @param {Record<string, unknown>} orderData
 * @returns {{ ok: true; payload: { items: Array<{ sku: string; quantity: number }>; comment?: string } } | { ok: false; message: string; status: number }}
 */
export function buildLkSiteOrderPayload(orderData) {
  /** @type {Map<string, number>} */
  const bySku = new Map();
  for (const item of orderData.cart || []) {
    const row = /** @type {Record<string, unknown>} */ (item);
    const sku = String(row?.sku ?? row?.id ?? '').trim();
    if (!sku) continue;
    let q = Math.floor(Number(row?.quantity) || 1);
    if (q < 1) q = 1;
    if (q > 999) q = 999;
    bySku.set(sku, (bySku.get(sku) || 0) + q);
  }

  const items = [];
  for (const [sku, quantity] of bySku) {
    let q = quantity;
    if (q > 999) q = 999;
    items.push({ sku, quantity: q });
  }

  if (items.length === 0) {
    return {
      ok: false,
      message: 'В заказе нет позиций с sku (артикул как в каталоге ЛК)',
      status: 400,
    };
  }

  /** @type {{ items: Array<{ sku: string; quantity: number }>; comment?: string }} */
  const payload = { items };
  const comment = String(orderData.comment ?? '').trim();
  if (comment) payload.comment = comment;

  return { ok: true, payload };
}

/**
 * @param {Record<string, unknown>} data
 */
export function formatLkSiteOrderErrorMessage(data) {
  if (data?.message && typeof data.message === 'string') return data.message;
  const errors = data?.errors;
  if (errors && typeof errors === 'object') {
    const msgs = [];
    for (const [key, val] of Object.entries(errors)) {
      if (Array.isArray(val)) msgs.push(...val.map((m) => `${key}: ${m}`));
      else msgs.push(`${key}: ${String(val)}`);
    }
    if (msgs.length) return msgs.join('; ');
  }
  return 'Не удалось оформить заказ';
}
