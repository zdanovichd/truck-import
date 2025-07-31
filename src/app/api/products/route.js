import { NextResponse } from 'next/server';
import productsData from '@/json/products.json';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let products = [...productsData];

    // Получаем все уникальные бренды и модели из исходных данных
    const allBrands = [...new Set(productsData.map(p => p.brand))];
    const allModels = [...new Set(productsData.map(p => p.model))];

    // Получаем параметры запроса
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1'; // По умолчанию первая страница
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const part = searchParams.get('part');

    // Фильтрация по бренду
    if (brand) {

      const selectedBrands = brand.split(',').map(m => m.trim().toLowerCase());

      // Если products - это массив всех продуктов
      let filteredProducts = products.filter(p =>
        selectedBrands.includes(p.brand.toLowerCase())
      );

      // Или если нужно фильтровать уже отфильтрованные данные
      filteredProducts = products.filter(p =>
        selectedBrands.some(selectedBrand =>
          p.brand.toLowerCase() === selectedBrand
        )
      );

      products = filteredProducts;

    }

    // Фильтрация по модели

    if (model) {

      const selectedModels = model.split(',').map(m => m.trim().toLowerCase());

      // Если products - это массив всех продуктов
      let filteredProducts = products.filter(p =>
        selectedModels.includes(p.model.toLowerCase())
      );

      // Или если нужно фильтровать уже отфильтрованные данные
      filteredProducts = products.filter(p =>
        selectedModels.some(selectedModel =>
          p.model.toLowerCase() === selectedModel
        )
      );

      products = filteredProducts;

    }

    if (part) {
      products = products.filter(p => p.category_slug.toLowerCase() === part.toLowerCase());
    }

    // Сортировка
    if (sortBy === 'price') {
      products.sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }
    // Если sortBy не указан или не 'price', сортируем по цене (по умолчанию)
    else {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    // Пагинация
    let paginatedProducts = [...products];
    const totalCount = products.length;

    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = parseInt(page);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      paginatedProducts = products.slice(startIndex, endIndex);
    }

    // await sleep(2000); // Ожидание 10 секунд (для тестирования)

    return NextResponse.json({
      paginatedProducts,
      totalCount,
      allBrands,
      allModels
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}