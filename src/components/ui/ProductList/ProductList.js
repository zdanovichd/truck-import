'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import styles from './productlist.module.css';
import * as CartActions from '@/actions/cart';

export default function ProductList({ products }) {
  const { innerWidth } = useWindowSize();
  const [cart, setCart] = useState({ i: [] });

  // Загружаем корзину при монтировании
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
    setCart(data);
  };

  if (!innerWidth) return null;

  return (
    <>
      {products.map(product => (
        <Suspense key={product.id} fallback={<p>Loading...</p>}>
          <ProductItem
            product={product}
            innerWidth={innerWidth}
            cart={cart}
            fetchCart={fetchCart} // передаем функцию, чтобы ProductItem мог обновлять корзину
          />
        </Suspense>
      ))}
    </>
  );
}

function ProductItem({ product, innerWidth, cart, fetchCart }) {
  // количество товара берется **из актуального состояния cart**
  const currentCount =
    cart.i.find(x => String(x[0]) === String(product.id))?.[1] || 0;

  const [count, setCount] = useState(currentCount);
  const [inputValue, setInputValue] = useState(String(currentCount));

  // обновляем состояние, когда меняется cart
  useEffect(() => {
    setCount(currentCount);
    setInputValue(String(currentCount));
  }, [currentCount]);

  const handleCountChange = async newCount => {
    const validatedCount = Math.max(0, Math.min(newCount, product.count));
    await CartActions.setCartQuantity(product.id, validatedCount);
    await fetchCart(); // синхронизируем корзину после изменения
  };

  const handleInputBlur = async () => {
    const numValue = parseInt(inputValue) || 1;
    await handleCountChange(numValue);
  };

  return (
    <div className={styles.product__card}>
      <div className={styles.product__image_container}>
        <Link href={`/catalog/${product.sku}`}>
          <div className={styles.product__image}>
            <p>{product.sku}</p>
          </div>
        </Link>
      </div>

      <div className={styles.product__code}>
        <Link href={`/catalog/${product.sku}`}>{product.sku}</Link>
      </div>

      <div className={styles.product__data}>
        <span className={styles.product__name}>
          <Link href={`/catalog/${product.sku}`}>
            <span className={styles.product__name_value}>{product.name}</span>
          </Link>
        </span>

        <span className={styles.product__brand}>
          <span className={styles.product__brand_name}>Бренд: </span>
          <span className={styles.product__brand_value}>
            {product.brand ? (
              <Link href={`/brands/${product.brand}`}>{product.brand_name || product.brand}</Link>
            ) : (
              <span>{product.brand_name || '—'}</span>
            )}
          </span>
        </span>

        <span className={styles.product__price}>
          <span className={styles.product__price_name}>Цена: </span>
          <span className={styles.product__price_value}>{product.price} ₽</span>
        </span>

        <div className={styles.cart__button}>
          {product.count > 0 ? (
            count > 0 ? (
              <>
                <button
                  className={styles.cart__button_enabled}
                  onClick={() => handleCountChange(count - 1)}
                >
                  -
                </button>

                <input
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={e => e.key === 'Enter' && handleInputBlur()}
                  max={product.count}
                  className={styles.counter__input}
                />

                <button
                  className={styles.cart__button_enabled}
                  onClick={() => handleCountChange(count + 1)}
                  disabled={count >= product.count}
                >
                  +
                </button>
              </>
            ) : (
              <button
                className={styles.cart__button_enabled}
                onClick={() => handleCountChange(count + 1)}
              >
                Купить
              </button>
            )
          ) : (
            <button className={styles.cart__button_disabled} disabled>
              Нет в наличии
            </button>
          )}

          {/* {count > 0 && (
            <span style={{ marginLeft: 8 }}>В корзине: {count}</span>
          )} */}
        </div>
      </div>
    </div>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    innerWidth: undefined,
    innerHeight: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}
