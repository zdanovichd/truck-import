"use client"
// import Image from "next/image";
import styles from "./product.module.css";
import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import Image from "next/image";
import Link from 'next/link';
import Reviews from "@/app/components/ui/Reviews/Reviews";
import Search from "@/app/components/ui/Search/Search";
import Faq from "@/app/components/sections/Faq/Faq";
import Feedback from "@/app/components/ui/Feedback/Feedback";
import { useState } from 'react';

export default function Product({ product = [] }) {
    const [count, setCount] = useState(0); // Основное значение
    const [inputValue, setInputValue] = useState(count.toString()); // Локальное значение для input

    // Обработчик изменения количества
    const handleCountChange = (newCount) => {
        const validatedCount = Math.max(0, Math.min(newCount, product.count)); // Ограничение min=1, max=product.count
        setCount(validatedCount);
        setInputValue(validatedCount.toString());
    };

    // Обработчик ввода
    const handleInputBlur = () => {
        const numValue = parseInt(inputValue) || 1; // Если не число - вернет 1
        handleCountChange(numValue);
    };
    console.log(count);
    const specifications = product.specifications;
  return (
    <main>
        <section className={styles.product__search}>
            <p className={styles.product__search_title}>Быстрый поиск детали по артикулу:</p>
            <Search />
        </section>
        <section className={styles.product}>
            <h1 className={styles.product__title}><span className={styles.product__name}>{product.name}</span> <span className={styles.sku}>{product.sku}</span></h1>
            <div className={styles.product__wrapper}>
                <div className={styles.product__data}>
                    <Image
                        src={`/products/${product.sku}/0.png`}
                        alt={`${product.name} ${product.sku}`}
                        className={styles.product__image}
                        width={500} // дефолтное значение (для SSR)
                        height={300}
                        style={{
                            width: 'calc(357vw/14.4)',
                            height: 'calc(371vw/14.4)',
                        }}
                    />
                    <div className={styles.specifications}>
                        <p className={styles.specifications__title}>Технические характеристики</p>
                        <div className={styles.specifications__inner}>
                            {specifications.map((item, index) => (
                                <span key={index} className={styles.specification}>
                                    <span className={styles.specification__name}>{item[0]}</span>
                                    <span className={styles.specification__value}>{item[1]}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.product__inner}>
                    <div className={styles.count}>
                        {product.count > 0 ? (
                                <p className={styles.in_stock}>Доступно для заказа</p>
                            ) : (
                                <p className={styles.out_of_stock}>Нет в наличии</p>
                            )}
                    </div>
                    <div className={styles.selling__data}>
                        <span className={styles.selling__brand}>
                            <span className={styles.selling__brand_name}>Бренд: </span>
                            <span className={styles.selling__brand_value}>
                            {product.brand}
                            </span>
                        </span>
                        <span className={styles.selling__delivery}>
                            <span className={styles.selling__delivery_name}>Сроки отправки: </span>
                            <span className={styles.selling__delivery_value}>{product.delivery}</span>
                        </span>
                        <span className={styles.selling__price}>
                            <span className={styles.selling__price_name}>Цена: </span>
                            <span className={styles.selling__price_value}>{product.price} ₽</span>
                        </span>
                    </div>
                    <div className={styles.cart__button}>
                        {product.count > 0 ? (
                            count > 0 ? (
                                <>
                                    <button
                                        className={styles.cart__button_enabled}
                                        onClick={() => handleCountChange(count - 1)}
                                        // disabled={count <= 1} // Отключаем если count = 1
                                    >
                                    -
                                    </button>

                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onBlur={handleInputBlur}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputBlur()}
                                        // min="0"
                                        max={product.count}
                                        className={styles.counter__input}
                                    />

                                    <button
                                        className={styles.cart__button_enabled}
                                        onClick={() => handleCountChange(count + 1)}
                                        disabled={count >= product.count} // Отключаем если достигнут максимум
                                    >
                                    +
                                    </button>
                                </>

                            ) : (
                                <button
                                    className={styles.cart__button_enabled}
                                    onClick={() => handleCountChange(count + 1)}
                                >
                                    <Image
                                        src="/cart.svg"
                                        alt="cart"
                                        width={500} // дефолтное значение (для SSR)
                                        height={300}
                                        style={{
                                            width: 'calc(25vw/14.4)',
                                            height: 'calc(25vw/14.4)',
                                        }}
                                    />
                                    Добавить в корзину
                                </button>
                            )
                            ) : (
                            <button
                                className={styles.cart__button_disabled}
                                disabled
                            >
                                Нет в наличии
                            </button>
                        )}

                    </div>
                </div>
            </div>
            <div className={styles.about}>
                <h2 className={styles.about__title}>О товаре:</h2>
                <p className={styles.about__description}>{product.description}</p>
            </div>
        </section>
    </main>
  );
}