import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { LK_TOKEN_COOKIE } from '@/lib/lk-auth-cookie';
import { applyClearLkAuthCookies } from '@/lib/lk-sso';
import { resolveVitrineAuthState } from '@/lib/lk-client-cart';

/**
 * Гидрация входа: при `ti_lk_token` — `GET {LK}/api/v1/auth/status` (Bearer как в ЛК, 200 + `authenticated` / `user`).
 * `authenticated: false` от ЛК → снимаем `ti_lk_token` и `ti_sso_state`.
 */
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';

  const state = await resolveVitrineAuthState(token);
  const { authenticated } = state;

  const res = NextResponse.json(state, { status: 200 });
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.headers.set('Vary', 'Cookie');

  if (token && !authenticated) {
    applyClearLkAuthCookies(res);
  }

  return res;
}
