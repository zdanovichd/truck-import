import { redirect } from 'next/navigation';

/** Раньше отдельная страница; оформление — через корзину и /auth/place-order. */
export default function LegacyCheckoutRedirect() {
  redirect('/cart');
}
