'use client'
import styles from "./sectiontitle.module.css";
import Image from "next/image";

export default function SectionTitle({ title=[], align = "center", fontSize = 36}) {
    const validTextAlignValues = [
        "left", "right", "center", "justify", "start", "end", "match-parent",
        "inherit", "initial", "unset"
      ];

    function validateTextAlign(value) {
        if (!validTextAlignValues.includes(value)) {
            throw new Error(`Invalid text-align value: "${value}". Valid values are: ${validTextAlignValues.join(", ")}`);
        }
        // console.log("Valid value:", value);
    }

    //   // Пример:
    validateTextAlign(align); // OK
    //   validateTextAlign("flex-start"); // Ошибка
    return (
        <h2
            className={styles.title}
            style={{
                textAlign: align,
                fontSize: `calc(${fontSize}vw/14.4)`
            }}
        >{title}</h2>
    )
}