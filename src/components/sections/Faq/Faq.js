'use client'
import Accordion from "../../ui/Accordion/Accordion";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import styles from "./faq.module.css";
import Image from "next/image";
import React, { useState } from 'react';

export default function Faq({ title = "", data = [] }) {

    const [isActive, setIsActive] = useState(false);

    return (
        <section className={styles.faqs}>
            <SectionTitle
                title={title}
                align="center"
            />
            <div className={styles.faqs__inner}>
                {data.map((item, index) => (
                    <Accordion key={index} index={index} data={item} />
                ))}
            </div>
        </section>
    )
}

