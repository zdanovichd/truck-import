/**
 * В URL каталога и в поле sku часто используется вид `BRAND-ARTICUL` (например `KOMATSU-17M-54-57520`),
 * а API ЛК в пути `GET …/products/{segment}` принимает только заводской артикул (`17M-54-57520`).
 */

/**
 * @param {string|number} segment
 * @returns {string[]}
 */
export function catalogProductLookupKeys(segment) {
  const t = String(segment ?? '').trim();
  if (!t) return [];
  const out = [];
  const seen = new Set();
  const push = (x) => {
    const k = String(x).trim();
    if (k && !seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  };
  push(t);
  let cur = t;
  for (let i = 0; i < 8; i += 1) {
    const dash = cur.indexOf('-');
    if (dash <= 0) break;
    const head = cur.slice(0, dash);
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(head)) break;
    cur = cur.slice(dash + 1).trim();
    if (!cur) break;
    push(cur);
  }
  return out;
}

/**
 * @param {string|number} segment
 * @returns {string[]}
 */
export function catalogProductSkuAliases(segment) {
  return catalogProductLookupKeys(segment).map((k) => k.toLowerCase());
}

/**
 * Один и тот же товар в slug / sku / корзине с разным префиксом бренда.
 * @param {string|number} a
 * @param {string|number} b
 */
export function catalogSegmentsReferToSameSku(a, b) {
  const setA = new Set(catalogProductSkuAliases(a));
  for (const x of catalogProductSkuAliases(b)) {
    if (setA.has(x)) return true;
  }
  return false;
}

/** Канонический артикул для ключа корзины / URL (как в `normalizeProduct` для ЛК). */
export function canonicalCatalogSkuFromSegment(segment) {
  const keys = catalogProductLookupKeys(String(segment ?? '').trim());
  return keys.length ? keys[keys.length - 1] : String(segment ?? '').trim();
}
