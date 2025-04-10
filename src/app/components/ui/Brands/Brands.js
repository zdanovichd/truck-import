'use client'
import styles from "./brands.module.css";
import Image from "next/image";
import Link from 'next/link';

export default function Brands({ brands = [], theme = "default" }) {
    if (brands.length > 5) {
        throw new Error("Количество брендов не может превышать 5");
    }
    return (
        <div className={styles.brands}>
            {brands.map((item, index) => (
                <Link href={`/catalog/${item}`}key={index}>
                    <Image
                        className={`${styles.brands__item} ${theme == 'gray' ? styles.brands__item_gray : ''}`}
                        src={`/brands/${item}.svg`}
                        alt={`${item} logo`}
                        width={500} // дефолтное значение (для SSR)
                        height={300}
                        style={{
                            width: 'calc(250vw/1.5/14.4)',
                            height: 'calc(100vw/1.5/14.4)',
                        }}
                    />
                </Link>
            ))}
        </div>
    )
}