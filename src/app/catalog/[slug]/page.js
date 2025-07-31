import styles from "./page.module.css";
import products from '@/json/products.json';
import Product from "@/components/ui/Product/Product";
import { notFound } from "next/navigation";
import { Suspense } from 'react';
async function getProduct(sku) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${sku}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null; // или можно вернуть объект с ошибкой { error: error.message }
  }
}


export async function generateMetadata({ params }) {

  const { slug } = await params
  // const products = data.products;
  const productData = getProduct(slug);
  const [product] = await Promise.all([productData])

  // const product = products.find(product => product.sku === slug);
  if (!product) {
    notFound();
  }

  if (product) {
    return {
      title: `${product.name} ${product.sku} — купить оптом с доставкой по России` || 'Default Title',
      description: `Приобрести ${product.name} ${product.sku} | Оптовые поставки запчастей из Европы для грузовых автомобилей. Узнать наличие и стоимость вы можете по телефону +7 (900) 604-46-14, звоните!` || 'Default Description',
    };
  }

}

export default async function Page({ params }) {
  const { slug } = await params
  // const products = data.products;

  const product = products.find(product => product.sku === slug);
  if (!product) {
    notFound();
  }

  return ( <>
    {product &&
      <Suspense fallback={<p>Loading product...</p>}>
        <Product product={product} />
      </Suspense>
    }
  </>
  );
}