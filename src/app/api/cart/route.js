import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const KEY = 'cart';

export async function GET() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(KEY)?.value;
  const cart = cartCookie ? JSON.parse(cartCookie) : { i: [] };

  return NextResponse.json(cart);
}
