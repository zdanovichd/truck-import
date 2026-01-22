'use client';
import { Suspense } from 'react';
import ProductAddToCartServer from "./ProductAddToCart.server.js";
import dynamic from 'next/dynamic';

const ProductAddToCartClient = dynamic(
  () => import('./ProductAddToCart.client.js'),
  { ssr: false }
);

export default function ProductAddToCart({ 
  props_count = 0, 
  productId,
  productSku 
}) {
  return (
    <>
      <ProductAddToCartServer 
        props_count={props_count} 
        productId={productId}
        productSku={productSku}
      />
      <Suspense fallback={null}>
        <ProductAddToCartClient 
          props_count={props_count} 
          productId={productId}
          productSku={productSku}
        />
      </Suspense>
    </>
  );
}