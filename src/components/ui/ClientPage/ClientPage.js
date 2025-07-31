import ProductList from '../ProductList/ProductList';
import BrandFilter from '../BrandFilter/BrandFilter'; // если ты хочешь оставить доп фильтрацию
import styles from './clientpage.module.css';
// import products from '@/json/products.json';
import { Suspense } from 'react';


async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=12?sortBy=price`);
  return await res.json();
}

export default async function ClientPage() {

  const productsData = getProducts();
  const [products] = await Promise.all([productsData]);

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
        <aside className={styles.filters}>
          {/* можно отключить фильтр по бренду, если он не нужен */}
          <BrandFilter
            // allBrands={allBrands}
            // selectedBrands={selectedBrands}
            // onChange={setSelectedBrands}
          />
        </aside>

        <div className={styles.products}>
        <Suspense fallback={<p>Loading feed...</p>}>
          <ProductList products={products} />
        </Suspense>
        </div>
      </section>
    </main>
  );
}
