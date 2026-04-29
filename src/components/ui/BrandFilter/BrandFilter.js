'use client';

import { useState, useEffect } from 'react';
import styles from './brandfilter.module.css';

export default function BrandFilter({ title = "", allBrands, selectedBrands, onChange }) {
  const handleCheckboxChange = (value) => {
    if (selectedBrands.includes(value)) {
      onChange(selectedBrands.filter((b) => b !== value));
    } else {
      onChange([...selectedBrands, value]);
    }
  };

  return (
    <div className={styles.filter}>
      <p className={styles.title}>{title}</p>
      <div className={styles.filters}>
        {allBrands.map((brandOption) => {
          const value = typeof brandOption === 'string' ? brandOption : brandOption?.value;
          const label = typeof brandOption === 'string' ? brandOption : (brandOption?.label || brandOption?.value);
          if (!value) return null;

          return (
            <label key={value} className={styles.checkbox}>
            <input
                type="checkbox"
                checked={selectedBrands.includes(value)}
                onChange={() => handleCheckboxChange(value)}
                className={styles.checkbox__input}
            />
                <span className={styles.checkbox__control}></span>
                <span className={styles.checkbox__label}>{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
