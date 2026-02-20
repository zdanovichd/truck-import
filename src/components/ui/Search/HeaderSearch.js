'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Search from './Search';
import ProductList from '@/components/ui/ProductList/ProductList';
import styles from './search.module.css';
import headerSearchStyles from './headerSearch.module.css';

export default function HeaderSearch({ style, onOpenChange, isOpen: isOpenFromParent }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.products || []);
        setTotalCount(data.totalCount ?? 0);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch {
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 3) {
      setResults([]);
      setTotalCount(0);
      return;
    }
    const t = setTimeout(() => fetchResults(query), 300);
    return () => clearTimeout(t);
  }, [isOpen, query, fetchResults]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('stop-scrolling');
    } else {
      document.body.classList.remove('stop-scrolling');
    }
    return () => document.body.classList.remove('stop-scrolling');
  }, [isOpen]);

  useEffect(() => {
    closeSearch();
  }, [pathname]);

  useEffect(() => {
    if (isOpenFromParent === false && isOpen) {
      setIsOpen(false);
      setQuery('');
      setResults([]);
      setTotalCount(0);
    }
  }, [isOpenFromParent, isOpen]);

  const openSearch = () => {
    setIsOpen(true);
    onOpenChange?.(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setTotalCount(0);
    onOpenChange?.(false);
  };

  return (
    <>
      {!isOpen ? (
        <button
          type="button"
          className={headerSearchStyles.headerSearch__button}
          onClick={openSearch}
          aria-label="Открыть поиск"
        >
        <span className={headerSearchStyles.headerSearch__iconContainer}>
          <svg
            className={headerSearchStyles.headerSearch__icon}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.0619 16.028L20.75 20.75M18.5833 9.91667C18.5833 14.7032 14.7032 18.5833 9.91667 18.5833C5.1302 18.5833 1.25 14.7032 1.25 9.91667C1.25 5.1302 5.1302 1.25 9.91667 1.25C14.7032 1.25 18.5833 5.1302 18.5833 9.91667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          </span>

          <span className={headerSearchStyles.headerSearch__buttonText}>Поиск</span>
        </button>
      ) : (
        <div className={headerSearchStyles.headerSearch__bar}>
          <Search
            style={style}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите номер детали или название"
            // rightSlot={null}
          />
          <button
            type="button"
            className={headerSearchStyles.headerSearch__close}
            onClick={closeSearch}
            aria-label="Закрыть поиск"
          >
            Закрыть
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L10 10M10 10L19 19M10 10L1 19M10 10L19 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Результаты поиска"
          className={headerSearchStyles.headerSearchDialog}
        >
          <div className={headerSearchStyles.headerSearchDialog__inner}>
            <div className={headerSearchStyles.headerSearch__results}>
            {loading && <p className={headerSearchStyles.headerSearch__loading}>Загрузка...</p>}
            {!loading && query.trim().length > 0 && query.trim().length < 3 && (
              <p className={headerSearchStyles.headerSearch__empty}>Введите от 3 символов</p>
            )}
            {/* {!loading && query.trim().length >= 3 && (
              <p className={headerSearchStyles.headerSearch__count}>Найдено: {totalCount}</p>
            )} */}
            {!loading && results.length > 0 && (
              <>
                <p className={headerSearchStyles.headerSearch__count}>Найдено товаров: {totalCount}</p>
                <div className={headerSearchStyles.headerSearch__products}>
                  <ProductList products={results} />
                </div>
              </>
            )}
            {!loading && query.trim().length >= 3 && results.length === 0 && totalCount === 0 && (
              <p className={headerSearchStyles.headerSearch__empty}>Не найдено <br/> Попробуйте другой запрос</p>
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}