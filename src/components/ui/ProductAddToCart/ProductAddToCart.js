'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ProductAddToCartClient = dynamic(() => import('./ProductAddToCart.client.js'), {
  ssr: true,
});

/** Всегда клиент с проверкой `auth/status` по клику; SSR `cartAuthenticated` не используем. */
export default function ProductAddToCart({ props_count = 0, productId, productSku }) {
  return (
    <Suspense fallback={null}>
      <ProductAddToCartClient
        props_count={props_count}
        productId={productId}
        productSku={productSku}
      />
    </Suspense>
  );
}
