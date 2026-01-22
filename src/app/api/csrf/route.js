import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  
  // Генерируем случайный токен
  const csrfToken = Math.random().toString(36).substring(2) + 
                    Date.now().toString(36);
  
  // Сохраняем в куки
  cookieStore.set({
    name: 'csrf_token',
    value: csrfToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 час
    path: '/',
  });

  return NextResponse.json({ csrfToken });
}