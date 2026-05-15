import { Suspense } from 'react';
import CatalogRouteListener from './CatalogRouteListener.client';

export default function CatalogLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <CatalogRouteListener />
      </Suspense>
      {children}
    </>
  );
}
