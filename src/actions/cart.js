'use server';
import { cookies } from 'next/headers';

const KEY = 'cart';

export async function addToCart(productId) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(KEY)?.value;
  const cart = cartCookie ? JSON.parse(cartCookie) : { i: [] };

  const id = String(productId);
  const item = cart.i.find(x => String(x[0]) === id);
  if (item) item[1]++;
  else cart.i.push([id, 1]);

  cookieStore.set({
    name: KEY,
    value: JSON.stringify(cart),
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  return cart;
}

export async function removeFromCart(productId) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(KEY)?.value;
  const cart = cartCookie ? JSON.parse(cartCookie) : { i: [] };

  const id = String(productId);
  cart.i = cart.i.filter(x => String(x[0]) !== id);

  cookieStore.set({
    name: KEY,
    value: JSON.stringify(cart),
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  return cart;
}

// Установить конкретное количество
export async function setCartQuantity(productId, qty) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(KEY)?.value;
  const cart = cartCookie ? JSON.parse(cartCookie) : { i: [] };

  const id = String(productId);
  const item = cart.i.find(x => String(x[0]) === id);
  if (item) {
    if (qty > 0) item[1] = qty;
    else cart.i = cart.i.filter(x => String(x[0]) !== id);
  } else if (qty > 0) {
    cart.i.push([id, qty]);
  }

  cookieStore.set({
    name: KEY,
    value: JSON.stringify(cart),
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  return cart;
}

// Очистка всей корзины
export async function clearCart() {
  const cookieStore = await cookies();
  const cart = { i: [] };
  cookieStore.set({
    name: KEY,
    value: JSON.stringify(cart),
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  return cart;
}

// Обновление всей корзины
export async function updateCart(items) {
  // items - массив [[id1, qty1], [id2, qty2], ...]
  
  // Сначала очищаем корзину
  await clearCart();
  
  // Затем добавляем все товары с новыми количествами
  for (const [productId, qty] of items) {
    await addToCart(productId, qty);
  }
}