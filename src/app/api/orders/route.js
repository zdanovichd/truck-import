import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  LK_TOKEN_COOKIE,
  lkBearerTokenLooksExpired,
} from '@/lib/lk-sso';
import {
  buildLkSiteOrderPayload,
  formatLkSiteOrderErrorMessage,
  postLkClientSiteOrder,
} from '@/lib/lk-site-order';

export async function POST(request) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LK_TOKEN_COOKIE)?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';

  if (!token || lkBearerTokenLooksExpired(token)) {
    return NextResponse.json(
      { success: false, message: 'Требуется авторизация', code: 'UNAUTHORIZED' },
      { status: 401 },
    );
  }

  let orderData;
  try {
    orderData = await request.json();
  } catch (jsonError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Неверный формат данных',
        error: jsonError.message,
      },
      { status: 400 },
    );
  }

  const built = buildLkSiteOrderPayload(orderData);
  if (!built.ok) {
    return NextResponse.json(
      { success: false, message: built.message },
      { status: built.status },
    );
  }

  try {
    const { ok, status, data } = await postLkClientSiteOrder(token, built.payload);

    if (ok && status === 200 && data.success === true && data.order_id != null) {
      return NextResponse.json({
        success: true,
        message: 'Заказ успешно создан',
        order_id: data.order_id,
        order_number: data.order_number,
        orderNumber: data.order_number,
      });
    }

    const message = formatLkSiteOrderErrorMessage(data);
    const code = typeof data.code === 'string' ? data.code : undefined;

    return NextResponse.json(
      {
        success: false,
        message,
        code,
        errors: data.errors,
      },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  } catch (error) {
    console.error('Ошибка в /api/orders (ЛК):', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Сервис заказов временно недоступен',
        error: error.message,
      },
      { status: 502 },
    );
  }
}
