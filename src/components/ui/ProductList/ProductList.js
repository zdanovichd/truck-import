'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from "react";
import styles from './productlist.module.css';
import { Suspense } from 'react';

export default function ProductList({ products }) {
    const { innerWidth, innerHeight } = useWindowSize();
    if (!innerWidth) {
        return null;
    }

    return (
        <>
            {products.map((product) => (
                <Suspense key={product.id} fallback={<p>Loading product...</p>}>
                    <ProductItem

                        product={product}
                        innerWidth={innerWidth}
                    />
                </Suspense>
            ))}
        </>
    );
}

function ProductItem({ product, innerWidth }) {
    const [count, setCount] = useState(0);
    const [inputValue, setInputValue] = useState(count.toString());

    const handleCountChange = (newCount) => {
        const validatedCount = Math.max(0, Math.min(newCount, product.count));
        setCount(validatedCount);
        setInputValue(validatedCount.toString());
    };

    const handleInputBlur = () => {
        const numValue = parseInt(inputValue) || 1;
        handleCountChange(numValue);
    };
    // console.log("Product generated")
    return (

            <div className={styles.product__card}>
                <div className={styles.product__image_container}>
                    <Link href={`/catalog/${product.sku}`}>
                        <div className={styles.product__image}>
                            {/* <p>{    product.name}</p> */}
                            <p>{product.sku}</p>
                        </div>
                        {/* <Image
                            src={`https://placehold.co/${parseInt(276 * 4 / 1440 * innerWidth)}x${parseInt(250 * 4 / 1440 * innerWidth)}.png?text=${product.sku}`}
                            // width={parseInt(276 / 1440 * innerWidth)}
                            // height={parseInt(250 / 1440 * innerWidth)}
                            fill
                            alt={`${product.name} ${product.sku}`}
                            className={styles.product__image}
                        /> */}
                    </Link>
                </div>

                <div className={styles.product__code}><Link href={`/catalog/${product.sku}`}>{product.sku}</Link></div>
                <div className={styles.product__data}>
                    <span className={styles.product__name}>
                        <Link href={`/catalog/${product.sku}`}>
                            <span className={styles.product__name_value}>
                                {product.name}
                            </span>
                        </Link>
                    </span>
                    <span className={styles.product__brand}>
                        <span className={styles.product__brand_name}>
                            Модель:{" "}
                        </span>
                        <span className={styles.product__brand_value}>
                            <Link href={`/brands/${product.model}`}>
                                {product.model}
                            </Link>
                        </span>
                    </span>
                    <span className={styles.product__price}>
                        <span className={styles.product__price_name}>
                            Цена:{" "}
                        </span>
                        <span className={styles.product__price_value}>
                            {product.price} ₽
                        </span>
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
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onBlur={handleInputBlur}
                                        onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
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
                                    {/* <Image
                                        src="/cart.svg"
                                        alt="cart"
                                        width={500}
                                        height={300}
                                        style={{
                                            width: "calc(25vw/14.4)",
                                            height: "calc(25vw/14.4)",
                                        }}
                                    /> */}
                                    Купить
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

        if (typeof window !== "undefined") {
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    return windowSize;
}