'use client'
import styles from "./feedback.module.css";
import Link from 'next/link';

export default function Feedback() {

    return (
        <div>
            <form action="" method="get" className={styles.feedback}>
                <input type="text" name="name" placeholder="Ваше имя" autoComplete="given-name" />
                <input type="tel" name="phone" placeholder="+7 (999) 999-99-99" autoComplete="tel" />
                <button type="submit">Оставить заявку</button>
            </form>
        </div>
    )
}

