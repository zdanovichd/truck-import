'use client';

import { useState, useEffect } from 'react';
import styles from './brandfilter.module.css';

export default function BrandFilter({ allBrands, selectedBrands, onChange }) {
  const handleCheckboxChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className={styles.filter}>
      <p className={styles.title}>Бренд</p>
      <div className={styles.filters}>
        {allBrands.map((brand) => (
            <label key={brand} className={styles.checkbox}>
            <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleCheckboxChange(brand)}
                className={styles.checkbox__input}
            />
                <span className={styles.checkbox__control}></span>
                {brand && <span className={styles.checkbox__label}>{brand}</span>}
            </label>
        ))}
      </div>
    </div>
  );
}
