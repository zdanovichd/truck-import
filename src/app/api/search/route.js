import { NextResponse } from 'next/server';
import {
  fetchLkProducts,
  getJsonProducts,
  isLkProductsSource,
} from '@/lib/products-source';

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

    const query = q.trim().toLowerCase();
    if (!query || query.length < 3) {
      return NextResponse.json({
        products: [],
        totalCount: 0,
      });
    }

    const sourceProducts = isLkProductsSource()
      ? await fetchLkProducts({ sku: query, limit: 200, page: 1 })
      : getJsonProducts();

    const matches = sourceProducts.filter((p) => {
      const nameMatch =
        p.name && String(p.name).toLowerCase().includes(query);
      const skuMatch =
        p.sku && String(p.sku).toLowerCase().includes(query);
      return nameMatch || skuMatch;
    });

    const totalCount = matches.length;
    let products = matches;

    if (limitParam) {
      const limitNum = Math.max(1, parseInt(limitParam, 10) || 10);
      const pageNum = Math.max(1, parseInt(pageParam, 10) || 1);
      const startIndex = (pageNum - 1) * limitNum;
      products = matches.slice(startIndex, startIndex + limitNum);
    }

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
