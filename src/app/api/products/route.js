import { NextResponse } from 'next/server';
import {
  fetchLkBrands,
  fetchLkProducts,
  fetchLkProductsPage,
  getJsonProducts,
  isLkProductsSource,
} from '@/lib/products-source';

function getMultiValue(searchParams, key) {
  const csv = searchParams.get(key);
  const arrayValues = searchParams.getAll(`${key}[]`);
  const values = [];

  if (csv) {
    values.push(
      ...csv
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    );
  }

  if (arrayValues.length > 0) {
    values.push(
      ...arrayValues
        .map((v) => v.trim())
        .filter(Boolean),
    );
  }

  if (values.length === 0) return null;
  return [...new Set(values)].join(',');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';
    const brand = getMultiValue(searchParams, 'brand');
    const model = getMultiValue(searchParams, 'model');
    const part = searchParams.get('part');
    const sku = searchParams.get('sku');
    const price = searchParams.get('price');

    if (isLkProductsSource()) {
      const baseQuery = { brand, model, part, sku, price };
      const [productsPage, modelsFirstPage, lkBrands] = await Promise.all([
        fetchLkProductsPage({ ...baseQuery, limit, page }),
        fetchLkProducts({ ...baseQuery, limit: 1000, page: 1 }),
        fetchLkBrands(),
      ]);

      return NextResponse.json({
        paginatedProducts: productsPage.items,
        totalCount: productsPage.total,
        allBrands: lkBrands,
        // TODO: when backend gives dedicated models endpoint, take all models from it.
        allModels: [...new Set(modelsFirstPage.map((p) => p.model).filter(Boolean))],
      });
    }

    let products = getJsonProducts();
    const allBrands = [...new Set(products.map((p) => p.brand))];
    const allModels = [...new Set(products.map((p) => p.model))];

    if (brand) {
      const selectedBrands = brand.split(',').map((m) => m.trim().toLowerCase());
      products = products.filter((p) =>
        selectedBrands.some((selectedBrand) => p.brand.toLowerCase() === selectedBrand),
      );
    }

    if (model) {
      const selectedModels = model.split(',').map((m) => m.trim().toLowerCase());
      products = products.filter((p) =>
        selectedModels.some((selectedModel) => p.model.toLowerCase() === selectedModel),
      );
    }

    if (part) {
      products = products.filter((p) => p.category_slug.toLowerCase() === part.toLowerCase());
    }

    if (sortBy === 'price') {
      products.sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    let paginatedProducts = [...products];
    const totalCount = products.length;

    if (limit) {
      const limitNum = parseInt(limit, 10);
      const pageNum = parseInt(page, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      paginatedProducts = products.slice(startIndex, endIndex);
    }

    return NextResponse.json({
      paginatedProducts,
      totalCount,
      allBrands: allBrands.filter(Boolean).map((b) => ({ value: b, label: b })),
      allModels: allModels.filter(Boolean),
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}