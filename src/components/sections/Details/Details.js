'use client'
import styles from "./details.module.css";
import Image from "next/image";
import Link from 'next/link';
import services from '@/json/services.json';

export default function Details({ sub = [], data = [] }) {
    // console.log(sub);
    return (
        <section className={styles.services}>
            {/* <div className={styles.services__inner}> */}
                {services.map((item, index) => (
                    <Link
                        key={index}
                        // href={`/catalog?model=${data.model}?part=${item.slug}`}
                        href={`/catalog?page=1&model=${data.slug}`}
                        className={styles.service}
                    >
                        <Image
                            className={styles.service__image}
                            src={item.image}
                            alt={`${item.title} ${data.name} ${sub.name}`}
                            width={500} // дефолтное значение (для SSR)
                            height={300}
                            style={{
                            
                            }}
                        />
                        <p className={styles.service__name}>{item.title} {data.name} {sub.name}</p>
                    </Link>
                ))}
            {/* </div> */}
        </section>
    )
}

