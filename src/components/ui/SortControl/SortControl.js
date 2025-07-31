'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './sortcontrol.module.css';

const options = [
  { value: 'cheap', label: 'Сначала дешевле' },
  { value: 'expensive', label: 'Сначала дороже' },
];

export default function SortControl({ onSortChange, selected }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selectedOption = options.find((o) => o.value === selected)?.label || 'Сортировка';

  // Закрытие по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onSortChange(value);
    setOpen(false);
  };

  return (
    <div className={styles.sortWrapper} ref={dropdownRef}>
      {/* <div className={styles.label}>Сортировка:</div> */}
      <div className={`${styles.dropdown} ${open ? styles.opened : ''}`} onClick={() => setOpen(!open)}>
        <span>{selectedOption}</span>
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.arrow}>
                <mask id="mask0_519_967" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_519_967)">
                    <path d="M10 14L4 8.0997L5.11828 7L10 11.8006L14.8817 7L16 8.0997L10 14Z" fill="#000000"/>
                </g>
            </svg>
        </span>
        {open && (
          <ul className={styles.menu}>
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.item} ${option.value === selected ? styles.active : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
