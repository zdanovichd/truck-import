'use client'
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import styles from "./faq.module.css";
import Image from "next/image";

export default function Faq({ title = "", data = [] }) {

    return (
        <section className={styles.faqs}>
            <SectionTitle
                title={title}
                align="center"
            />
            <div className={styles.faqs__inner}>
                {data.map((item, index) => (
                    <div className={styles.faq} key={index}>
                        <div className={styles.faq__inner}>
                            <h3 className={styles.faq__question}>{item[0]}</h3>
                            <button className={styles.faq__toggle}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_27_514)">
                                        <path d="M7.00035 0.565313V13.4347" stroke="#141313" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M0.565552 7.00008H13.4349" stroke="#141313" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_27_514">
                                            <rect width="14" height="14" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>

                        <p className={styles.faq__answer}>{item[1]}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

