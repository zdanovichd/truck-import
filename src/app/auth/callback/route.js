import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  LK_TOKEN_COOKIE,
  SSO_STATE_COOKIE,
  exchangeSsoCode,
  lkTokenCookieOptions,
} from '@/lib/lk-sso';

function redirectWithError(request, code) {
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  url.searchParams.set('auth_error', code);
  return NextResponse.redirect(url);
}

/**
 * Callback с lk: проверка state, обмен code → token, httpOnly-cookie.
 */
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  if (searchParams.get('error')) {
    return redirectWithError(request, 'provider');
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(SSO_STATE_COOKIE)?.value;

  cookieStore.delete(SSO_STATE_COOKIE);

  if (!code) {
    return redirectWithError(request, 'missing_code');
  }
  if (!state || !expectedState || state !== expectedState) {
    return redirectWithError(request, 'state');
  }

  try {
    const data = await exchangeSsoCode(code);
    cookieStore.set(LK_TOKEN_COOKIE, data.token, lkTokenCookieOptions());
  } catch {
    return redirectWithError(request, 'exchange');
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url);
}
