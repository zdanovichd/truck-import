import { NextResponse } from 'next/server';
import products from '@/json/products.json';

export async function GET(request) {
  // Получаем полный URL
  const url = new URL(request.url);
  // Например: http://localhost:3000/api/products/1
  
  // Получаем pathname: "/api/products/1"
  const pathname = url.pathname;
  
  // Разбиваем по слэшам: ["", "api", "products", "1"]
  const segments = pathname.split('/');
  
  // Последний элемент: "1"
  const idOrSku = segments[segments.length - 1];
  
  // console.log('URL:', url.toString());
  // console.log('Pathname:', pathname);
  // console.log('Segments:', segments);
  // console.log('Last segment:', idOrSku);
  
  // Теперь ищем товар
  // const products = [
  //   { id: 1, name: "Service kit", sku: "STD1783", price: "0.90" },
  //   { id: 2, name: "P.a.", sku: "RUM003385", price: "0.90" }
  // ];
  
  let product = null;
  
  // Пробуем как число
  const numId = Number(idOrSku);
  if (!isNaN(numId)) {
    product = products.find(p => p.id === numId);
  }
  
  // Если не нашли, пробуем как SKU
  if (!product) {
    product = products.find(p => p.sku === idOrSku);
  }
  
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