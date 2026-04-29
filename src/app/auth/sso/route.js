import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SSO_STATE_COOKIE,
  createSsoState,
  buildSsoAuthorizeUrl,
  ssoStateCookieOptions,
} from '@/lib/lk-sso';

/**
 * Начало SSO: редирект на lk с redirect_uri на этот сайт и случайным state.
 */
export async function GET(request) {
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/auth/callback`;
  const state = createSsoState();

  const cookieStore = await cookies();
  cookieStore.set(SSO_STATE_COOKIE, state, ssoStateCookieOptions());

  const authorizeUrl = buildSsoAuthorizeUrl(redirectUri, state);
  return NextResponse.redirect(authorizeUrl);
}
