import { NextResponse } from 'next/server';
import {
  SSO_STATE_COOKIE,
  createSsoState,
  buildSsoAuthorizeUrl,
  ssoStateCookieOptions,
  normalizeSsoPostLoginPath,
  composeSsoOAuthState,
  getPublicSiteBase,
} from '@/lib/lk-sso';

/**
 * Начало SSO: редирект на lk с redirect_uri на этот сайт и случайным state.
 * `?next=/cart` — после callback вернуть в корзину (суффикс в OAuth state, не отдельная cookie:
 * иначе при несовпадении www/apex с redirect_uri cookie на callback не доезжает).
 */
export async function GET(request) {
  const origin = getPublicSiteBase(request);
  const redirectUri = `${origin}/auth/callback`;
  const nonce = createSsoState();
  const nextRaw = request.nextUrl.searchParams.get('next');
  const postLogin = normalizeSsoPostLoginPath(nextRaw ?? '');
  const oauthState = composeSsoOAuthState(nonce, postLogin);

  const authorizeUrl = buildSsoAuthorizeUrl(redirectUri, oauthState);
  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set(SSO_STATE_COOKIE, oauthState, ssoStateCookieOptions());

  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  return res;
}
