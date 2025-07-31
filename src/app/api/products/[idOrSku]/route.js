import { NextResponse } from 'next/server';
import productsData from '@/json/products.json';

export async function GET(request) {

  try {
    // Получаем idOrSku из URL
    const pathname = request.nextUrl.pathname;
    const idOrSku = pathname.split('/').pop();

    // Ищем товар по ID или SKU
    const product = productsData.find(
      p => p.id === idOrSku || p.sku === idOrSku
    );

    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}