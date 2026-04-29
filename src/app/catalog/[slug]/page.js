import styles from "./page.module.css";
import Product from "@/components/ui/Product/Product";
import { notFound } from "next/navigation";
import { Suspense } from 'react';
import { headers } from "next/headers";

async function getBaseUrl() {
  const headersStore = await headers();
  const host = headersStore.get('x-forwarded-host') || headersStore.get('host');
  const protocol = headersStore.get('x-forwarded-proto') || 'http';
  return host
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
}

async function getProduct(sku) {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/products/${sku}`, { cache: 'no-store' });

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
  const product = await getProduct(slug);
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