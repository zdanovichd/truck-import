import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LK_TOKEN_COOKIE } from '@/lib/lk-auth-cookie';
import { verifyLkBearerActive } from '@/lib/lk-client-cart';

export const dynamic = 'force-dynamic';

export default async function CartLayout({ children }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';
  if (!token) {
    redirect('/auth/sso?next=/cart');
  }
  if (!(await verifyLkBearerActive(token))) {
    redirect('/auth/logout?next=/cart');
  }
  return children;
}
