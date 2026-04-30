import { NextResponse } from 'next/server';
import { fetchLkProductsPage } from '@/lib/products-source';

/**
 * GET /api/search?q=...&limit=...&page=...
 * Поиск товаров по названию (name) или артикулу (sku).
 * Параметр q — строка поиска (обязательный).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page') || '1';

    if (!q || typeof q !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid query parameter: q' },
        { status: 400 }
      );
    }

    const query = q.trim();
    if (!query || query.length < 3) {
      return NextResponse.json({
        products: [],
        totalCount: 0,
      });
    }
    const limitNum = Math.max(1, parseInt(limitParam, 10) || 20);
    const pageNum = Math.max(1, parseInt(pageParam, 10) || 1);
    const { items: products, total: totalCount } = await fetchLkProductsPage({
      sku: query,
      limit: limitNum,
      page: pageNum,
    });

    return NextResponse.json({
      products,
      totalCount,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
