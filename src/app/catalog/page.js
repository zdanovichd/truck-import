import services from '@/json/services.json';
import brands from '@/json/brands.json';
import { notFound } from 'next/navigation';
import ClientPage from '@/components/ui/ClientPage/ClientPage';
import { ProductsContainer } from './container';
import { SWRConfig } from "swr";
import { Suspense } from "react";
import { getProducts } from "@/services/get-products";
// import SortControl from '@/components/ui/SortControl/SortControl';
import { LIMIT } from "./constants";
import styles from './page.module.css'

export default async function Page({ searchParams }) {
  const { page = "1" } = await searchParams

  let pageNumber = 1
  if (typeof page === "string") {
    pageNumber = parseInt(page) || 1
  }

  console.log(pageNumber);

  return (
    <main>
      <section className={styles.catalog__hero}>
        <h1 className={styles.catalog__title}>
          {/* {service.title} для {brand.name} */}
          Каталог
        </h1>
        {/* <SortControl onSortChange={handleSortChange} selected={sortType} /> */}
      </section>

      <section className={styles.catalog__content}>

    <Suspense fallback="suspense loading ...">
      <SWRConfig
        value={{
          fallback: {
            [`products?page=${page}&limit=${LIMIT}`]: getProducts({
              page: pageNumber,
              limit: LIMIT
            })
          }
        }}
      >
        <ProductsContainer/>
        {/* <ClientPage/> */}
      </SWRConfig>
    </Suspense>
    </section>
    </main>
  );
}
