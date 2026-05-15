/** Имя httpOnly-cookie с Bearer-токеном для API ЛК (см. SSO callback). */
export const LK_TOKEN_COOKIE = 'ti_lk_token';

const JWT_EXP_SKEW_MS = 30_000;

/**
 * Если строка похожа на JWT и в payload есть `exp` — считаем токен просроченным по `exp`.
 * Не-JWT и JWT без `exp` не трогаем (opaque-токен остаётся «живым» до ответа API ЛК).
 * Реализация без Node `Buffer` — пригодна для Edge (middleware).
 * @param {string} token
 */
export function lkBearerTokenLooksExpired(token) {
  if (typeof token !== 'string' || !token.trim()) return true;
  const t = token.trim();
  const parts = t.split('.');
  if (parts.length !== 3) return false;
  try {
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const payload = JSON.parse(atob(b64));
    if (typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 <= Date.now() + JWT_EXP_SKEW_MS;
  } catch {
    return false;
  }
}

/** @param {{ get: (name: string) => { value?: string } | undefined }} cookies */
export function hasLkTokenCookieRaw(cookies) {
  const raw = cookies.get(LK_TOKEN_COOKIE)?.value;
  return typeof raw === 'string' && raw.trim().length > 0;
}

/** @param {{ get: (name: string) => { value?: string } | undefined }} cookies */
export function isSiteAuthFromRequestCookies(cookies) {
  const raw = cookies.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  return Boolean(token && !lkBearerTokenLooksExpired(token));
}
