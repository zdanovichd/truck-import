import { NextResponse } from 'next/server';
import { fetchProductByIdOrSku, isLkProductsSource } from '@/lib/products-source';

function decodeLastPathSegment(segment) {
  try {
    return decodeURIComponent(String(segment ?? '')).trim();
  } catch {
    return String(segment ?? '').trim();
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const segments = pathname.split('/');
  const rawSegment = segments[segments.length - 1];
  const idOrSku = decodeLastPathSegment(rawSegment);
  const product = await fetchProductByIdOrSku(idOrSku);

  if (!product) {
    return NextResponse.json(
      {
        error: 'Product not found',
        searched: idOrSku,
        extractedFromUrl: {
          fullUrl: url.toString(),
          pathname,
          segments,
          lastSegment: idOrSku,
        },
      },
      { status: 404 },
    );
  }

  if (isLkProductsSource()) {
    const p = idOrSku;
    const sku = String(product.sku ?? '').trim();
    const bySku = sku.length > 0 && sku.toLowerCase() === p.toLowerCase();
    const byId = String(product.id) === p;
    if (!bySku && !byId) {
      return NextResponse.json(
        {
          error: 'Product not found',
          message: 'Укажите в URL артикул как в каталоге ЛК или числовой id товара.',
          searched: idOrSku,
          canonicalSku: sku || undefined,
        },
        { status: 404 },
      );
    }
  }

  return NextResponse.json(product);
}