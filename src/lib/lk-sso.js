import { randomBytes } from 'crypto';

/** Имя cookie с Bearer-токеном для API lk (httpOnly). */
export const LK_TOKEN_COOKIE = 'ti_lk_token';

/** Временная cookie для проверки state при возврате с SSO. */
export const SSO_STATE_COOKIE = 'ti_sso_state';

export function getLkApiBase() {
  const base = process.env.LK_API_BASE_URL || 'https://lk.truck-import.ru';
  return base.replace(/\/$/, '');
}

export function createSsoState() {
  return randomBytes(32).toString('hex');
}

export function buildSsoAuthorizeUrl(redirectUri, state) {
  const base = getLkApiBase();
  const url = new URL(`${base}/sso/authorize`);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  return url.toString();
}

function cookieBaseOptions() {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
  };
}

export function ssoStateCookieOptions() {
  return {
    ...cookieBaseOptions(),
    maxAge: 600,
  };
}

export function lkTokenCookieOptions() {
  const maxAgeRaw = process.env.LK_AUTH_COOKIE_MAX_AGE;
  const maxAge = maxAgeRaw ? Number.parseInt(maxAgeRaw, 10) : 60 * 60 * 24 * 30;
  return {
    ...cookieBaseOptions(),
    maxAge: Number.isFinite(maxAge) && maxAge > 0 ? maxAge : 60 * 60 * 24 * 30,
  };
}

/**
 * @param {string} code
 * @returns {Promise<{ token: string, token_type?: string, user?: unknown }>}
 */
export async function exchangeSsoCode(code) {
  const res = await fetch(`${getLkApiBase()}/api/v1/auth/sso/exchange`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
    cache: 'no-store',
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data.message || `SSO exchange failed: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  if (!data.token || typeof data.token !== 'string') {
    const err = new Error('SSO exchange: missing token in response');
    err.status = 502;
    throw err;
  }

  return data;
}
