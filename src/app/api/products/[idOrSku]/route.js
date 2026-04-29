import { NextResponse } from 'next/server';
import { fetchProductByIdOrSku } from '@/lib/products-source';

export async function GET(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const segments = pathname.split('/');
  const idOrSku = segments[segments.length - 1];
  const product = await fetchProductByIdOrSku(idOrSku);
  
  if (product) {
    return NextResponse.json(product);
  }
  
  return NextResponse.json(
    { 
      error: 'Product not found',
      searched: idOrSku,
      extractedFromUrl: {
        fullUrl: url.toString(),
        pathname: pathname,
        segments: segments,
        lastSegment: idOrSku
      }
    },
    { status: 404 }
  );
}