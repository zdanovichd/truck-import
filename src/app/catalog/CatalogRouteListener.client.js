'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * При каждом переходе внутри /catalog (список, пагинация, фильтры, карточка товара)
 * перезапрашиваем RSC (актуальные cookies → cartAuthenticated на сервере) и сигналим
 * клиентским спискам перечитать /api/cart.
 */
export default function CatalogRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const first = useRef(true);
  const search = searchParams?.toString() ?? '';

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    router.refresh();
    window.dispatchEvent(new CustomEvent('catalog-auth-refresh'));
  }, [pathname, search, router]);

  return null;
}
