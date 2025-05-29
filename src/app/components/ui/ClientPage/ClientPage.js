'use client';

import { useState, useMemo } from 'react';
import { Suspense } from 'react'
import SortControl from '../SortControl/SortControl';
import ProductList from '../ProductList/ProductList';
import BrandFilter from '../BrandFilter/BrandFilter'; // если ты хочешь оставить доп фильтрацию
import styles from './clientpage.module.css';
import data from '../../../json/data.json';

export default function ClientPage({ brand, service }) {
  const initialProducts = data.products;

  // ✅ Фильтруем по имени бренда, полученному из пропсов
  const brandFilteredProducts = useMemo(() => {
    return initialProducts.filter(
      (product) => product.model.toLowerCase() === brand.slug.toLowerCase()
    );
  }, [initialProducts, brand.slug]);

  // Получаем список брендов из этой группы, если нужны чекбоксы
  const allBrands = useMemo(() => {
    const brandSet = new Set(brandFilteredProducts.map(p => p.brand));
    return Array.from(brandSet);
  }, [brandFilteredProducts]);

  const [sortType, setSortType] = useState('cheap');
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Фильтрация и сортировка
  const finalProducts = useMemo(() => {
    const filtered = selectedBrands.length > 0
      ? brandFilteredProducts.filter(p => selectedBrands.includes(p.brand))
      : brandFilteredProducts;

    return [...filtered].sort((a, b) =>
      sortType === 'cheap'
        ? Number(a.price) - Number(b.price)
        : Number(b.price) - Number(a.price)
    );
  }, [brandFilteredProducts, sortType, selectedBrands]);

  const handleSortChange = (type) => {
    setSortType(type);
  };

  return (
    <main>
      <section className={styles.catalog__hero}>
        <h1 className={styles.catalog__title}>
          {service.title} для {brand.name}
        </h1>
        <SortControl onSortChange={handleSortChange} selected={sortType} />
      </section>

      <section className={styles.catalog__content}>
        <aside className={styles.filters}>
          {/* можно отключить фильтр по бренду, если он не нужен */}
          <BrandFilter
            allBrands={allBrands}
            selectedBrands={selectedBrands}
            onChange={setSelectedBrands}
          />
        </aside>

        <div className={styles.products}>
            <Suspense fallback={<p>Loading feed...</p>}>
                <ProductList products={finalProducts} />
            </Suspense>
        </div>
      </section>
    </main>
  );
}
