'use client'
import styles from "./feedback.module.css";
import Link from 'next/link';

export default function Feedback() {

    return (
        <div className={`${styles.feedback} feedback`}>
            <p className={styles.feedback__title}>Остались вопросы?</p>
            <p className={styles.feedback__subtitle}>Оставьте заявку, и мы свяжемся с Вами в ближайшее время</p>
            <form action="" method="get" className={styles.feedback__form}>
                <input type="text" name="name" placeholder="Ваше имя" autoComplete="given-name" />
                <input type="tel" name="phone" placeholder="+7 (999) 999-99-99" autoComplete="tel" />
                <button type="submit">Оставить заявку</button>
            </form>
            <p className={styles.feedback__mark}>*Нажимая на кнопку, Вы соглашаетесь согласие на обработку персональных данных согласно Политике конфиденциальности</p>
        </div>
    )
}

