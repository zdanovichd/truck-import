'use client';

import { useState } from 'react';
import SortControl from '../SortControl/SortControl';
import ProductList from '../ProductList/ProductList';
import styles from './clientpage.module.css';

export default function ClientPage({ brand, service }) {
    const initialProducts = [
        { id: 1, name: 'Смартфон', price: 25000 },
        { id: 2, name: 'Ноутбук', price: 65000 },
        { id: 3, name: 'Наушники', price: 5000 },
        { id: 4, name: 'Планшет', price: 32000 },
      ];

      // Сортировка по умолчанию — сначала дешевле
      const [sortType, setSortType] = useState('cheap');
      const [products, setProducts] = useState(
        [...initialProducts].sort((a, b) => a.price - b.price)
      );

      const handleSortChange = (type) => {
        setSortType(type);
        const sorted = [...initialProducts].sort((a, b) =>
          type === 'cheap' ? a.price - b.price : b.price - a.price
        );
        setProducts(sorted);
      };

  return (
    <main>
      <section className={styles.catalog__hero}>
        <h1 className={styles.catalog__title}>{service.title} для {brand.name}</h1>
        <SortControl onSortChange={handleSortChange} selected={sortType} />
      </section>
      <section>
        <ProductList products={products} />
      </section>
    </main>
  );
}
