'use client'
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import styles from "./advantages.module.css";
import Image from "next/image";

export default function Advantages({ advantages = [], advantagesText = "normal" }) {
    if (advantages.length > 5) {
        throw new Error("Количество преимуществ не может превышать 5");
    }
    return (
        <section className={styles.advantages}>
            <SectionTitle
                title="Преимущества для оптовых покупателей"
                align="center"
            />
            <div className={styles.advantages__inner}>
                {advantages.map((item, index) => (
                    <div key={index} className={styles.advantages__item}>
                        {/* <img className={styles.advantages__image} src="/img/vigoda-1.svg" alt="vigoda-1"> */}
                        <Image
                            className={styles.advantages__image}
                            src={`/${item[0]}.svg`}
                            alt={`${item[0]} logo`}
                            width={400} // дефолтное значение (для SSR)
                            height={300}
                            style={{
                                width: 'auto',
                                height: 'calc(87vw/14.4)',
                            }}
                            priority
                        />
                        <p
                            className={`${styles.advantages__text} ${advantagesText == 'small' ? styles.advantages__text_small : ''}`}
                            dangerouslySetInnerHTML={{ __html: item[1] }}
                        >
                            {/* {item[1]} */}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}