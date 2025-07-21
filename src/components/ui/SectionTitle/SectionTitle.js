'use client'
import styles from "./sectiontitle.module.css";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from 'react';

export default function SectionTitle({ title=[], align = "center", fontSizeDesktop = 36, fontSizeMobile = 24}) {
    const validTextAlignValues = [
        "left", "right", "center", "justify", "start", "end", "match-parent",
        "inherit", "initial", "unset"
      ];

    const [isMobile, setIsMobile] = useState(false);
    const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsMobile(true)
        } else {
          setIsMobile(false)
        }
    }

    function validateTextAlign(value) {
        if (!validTextAlignValues.includes(value)) {
            throw new Error(`Invalid text-align value: "${value}". Valid values are: ${validTextAlignValues.join(", ")}`);
        }
        // console.log("Valid value:", value);
    }
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
    })

    //   // Пример:
    validateTextAlign(align); // OK
    //   validateTextAlign("flex-start"); // Ошибка
    return (
        <h2
            className={styles.title}
            style={{
                textAlign: align,
                fontSize: `calc(${isMobile ? fontSizeMobile : fontSizeDesktop}vw/${isMobile ? '3.9' : '14.4'})`
            }}
        >{title}</h2>
    )
}