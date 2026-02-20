'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Search from './Search';
import styles from './search.module.css';
import resultsStyles from './searchWithResults.module.css';

export default function SearchWithResults({ style, placeholder = 'Введите номер детали' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const fetchResults = useCallback(async (q) => {
    if (!q.trim() || q.trim().length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=20`);
      const data = await res.json();
      setResults(res.ok && data.products ? data.products : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim().length >= 3) {
        setOpen(true);
        fetchResults(query);
      } else {
        setOpen(false);
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, fetchResults]);

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 150);
  };

  const showPanel = open && query.trim().length >= 3 && focused;

  return (
    <div className={resultsStyles.wrapper}>
      <Search
        style={style}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {showPanel && (
        <div className={resultsStyles.panel}>
          {loading && (
            <div className={resultsStyles.message}>Загрузка...</div>
          )}
          {!loading && results.length === 0 && (
            <div className={resultsStyles.message}>
              Ничего не найдено. Попробуйте еще раз
            </div>
          )}
          {!loading && results.length > 0 && (
            <div className={resultsStyles.list}>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalog/${product.sku}`}
                  className={resultsStyles.item}
                >
                  <span className={resultsStyles.item__sku}>{product.sku}</span>
                  <span className={resultsStyles.item__brand}>{product.brand}</span>
                  <span className={resultsStyles.item__name}>{product.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
