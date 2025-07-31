"use client";
import { useState, useEffect } from "react";
import styles from "./productaddtocart.module.css";

export default function ProductAddToCartClient({ props_count = 0 }) {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("0");

  useEffect(() => {
    // Гидрация - добавляем обработчики к серверной кнопке
    const button = document.getElementById('add-to-cart-button');
    if (button) {
      button.addEventListener('click', () => (
        handleCountChange(count + 1),
        button.style.display = 'none'
    ));

    }
  }, []);

  const handleCountChange = (newCount) => {
    const validatedCount = Math.max(0, Math.min(newCount, props_count));
    setCount(validatedCount);
    setInputValue(validatedCount.toString());
    if (validatedCount === 0) {
      const button = document.getElementById('add-to-cart-button');
      if (button) button.style.display = '';
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue) || 0;
    handleCountChange(numValue);
  };

  if (count === 0) return null; // Не рендерим ничего, используем серверную кнопку

  return (
    <div className={styles.cart__button}>
      <button
        className={styles.cart__button_enabled}
        onClick={() => handleCountChange(count - 1)}
      >
        -
      </button>

      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleInputBlur}
        onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
        max={props_count}
        className={styles.counter__input}
      />

      <button
        className={styles.cart__button_enabled}
        onClick={() => handleCountChange(count + 1)}
        disabled={count >= props_count}
      >
        +
      </button>
    </div>
  );
}