import styles from "./page.module.css";
import products from '@/json/products.json';
import Product from "@/components/ui/Product/Product";
import { notFound } from "next/navigation";
import { Suspense } from 'react';
async function getProduct(sku) {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${sku}`);

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
      title: product?.meta__title || 'Default Title',
      description: product?.meta__description || 'Default Description',
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