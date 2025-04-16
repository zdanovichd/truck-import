'use client'
import styles from "./details.module.css";
import Image from "next/image";
import Link from 'next/link';
import services from './data.json';

export default function Details({ sub = [], data = [] }) {
    // console.log(sub);
    return (
        <section className={styles.services}>
            {/* <div className={styles.services__inner}> */}
                {services.map((item, index) => (
                    <Link
                        key={index}
                        href={`/catalog/${data.slug}/${sub.slug}/${item.slug}`}
                        className={styles.service}
                    >
                        <Image
                            className={styles.service__image}
                            src={item.image}
                            alt={`${item.title} ${data.name} ${sub.name}`}
                            width={500} // дефолтное значение (для SSR)
                            height={300}
                            style={{
                            width: 'calc(220vw/14.4)',
                            height: 'calc(200vw/14.4)',
                            objectFit: 'cover',
                            }}
                        />
                        <p className={styles.service__name}>{item.title} {data.name} {sub.name}</p>
                    </Link>
                ))}
            {/* </div> */}
        </section>
    )
}

