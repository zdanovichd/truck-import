"use client";
import { useState, useEffect } from "react";
import * as CartActions from '@/actions/cart';
import styles from "./productaddtocart.module.css";

export default function ProductAddToCartClient({ 
  props_count = 0, 
  productId,
  productSku 
}) {
  const [cart, setCart] = useState({ i: [] });
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("0");

  // Загружаем корзину при монтировании
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
      
      // Находим текущее количество для этого товара
      const currentCount = 
        data.i.find(x => String(x[0]) === String(productId))?.[1] || 0;
      setCount(currentCount);
      setInputValue(String(currentCount));
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    }
  };

  useEffect(() => {
    // Гидрация - добавляем обработчики к серверной кнопке
    const button = document.getElementById(`add-to-cart-button-${productId}`);
    if (button) {
      const handleClick = async () => {
        await handleCountChange(1);
        button.style.display = 'none';
      };
      
      button.addEventListener('click', handleClick);
      
      // Если товар уже в корзине, скрываем серверную кнопку
      if (count > 0) {
        button.style.display = 'none';
      }
      
      return () => {
        button.removeEventListener('click', handleClick);
      };
    }
  }, [productId, count]);

  const handleCountChange = async (newCount) => {
    const validatedCount = Math.max(0, Math.min(newCount, props_count));
    
    try {
      await CartActions.setCartQuantity(productId, validatedCount);
      
      // Обновляем локальное состояние
      setCount(validatedCount);
      setInputValue(validatedCount.toString());
      
      // Обновляем данные корзины
      await fetchCart();
      
      // Показываем/скрываем серверную кнопку
      const button = document.getElementById(`add-to-cart-button-${productId}`);
      if (button) {
        button.style.display = validatedCount === 0 ? '' : 'none';
      }
    } catch (error) {
      console.error('Ошибка обновления корзины:', error);
    }
  };

  const handleInputBlur = async () => {
    const numValue = parseInt(inputValue) || 0;
    await handleCountChange(numValue);
  };

  const handleInputKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleInputBlur();
    }
  };

  // Если товара нет в корзине, не рендерим клиентский компонент
  // (полагаемся на серверную кнопку)
  if (count === 0) return null;

  return (
    <div className={styles.cart__button}>
      <button
        className={styles.cart__button_enabled}
        onClick={() => handleCountChange(count - 1)}
        aria-label="Уменьшить количество"
      >
        -
      </button>

      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        max={props_count}
        min="0"
        className={styles.counter__input}
        aria-label={`Количество товара ${productSku}`}
      />

      <button
        className={styles.cart__button_enabled}
        onClick={() => handleCountChange(count + 1)}
        disabled={count >= props_count}
        aria-label="Увеличить количество"
      >
        +
      </button>
      
      {/* {count > 0 && (
        <span className={styles.cart__count_info}>
          В корзине: {count}
        </span>
      )} */}
    </div>
  );
}