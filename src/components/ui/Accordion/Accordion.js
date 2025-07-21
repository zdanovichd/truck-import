'use client'
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import styles from "./accordion.module.css";
import Image from "next/image";
import React, { useState } from 'react';

export default function Accordion({ index, data = [] }) {

    const [isActive, setIsActive] = useState(false);
    // if (index == 0 && !isActive) {
    //     setIsActive(true);
    // }
    // console.log(index)
    return (
        <div className={`${styles.accordion} ${isActive ? styles.__active : ''}`}>
            <div
                className={styles.accordion__inner}
                onClick={() => setIsActive(!isActive)}
            >
                <h3 className={styles.accordion__question}>{data[0]}</h3>
                <button className={styles.accordion__toggle}>
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
            <p className={styles.accordion__answer}>{data[1]}</p>
        </div>
    )
}

