'use client'
import styles from "./search.module.css";
// import Image from "next/image";

export default function Search({style}) {
    return (
        <form className={styles.search} style={style}>
            <input
                className={styles.search__input}
                type="search"
                name="s"
                placeholder="Введите номер детали"
            />
            <button className={styles.search__button}>
                <svg
                    className={styles.search__icon}
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16.0619 16.028L20.75 20.75M18.5833 9.91667C18.5833 14.7032 14.7032 18.5833 9.91667 18.5833C5.1302 18.5833 1.25 14.7032 1.25 9.91667C1.25 5.1302 5.1302 1.25 9.91667 1.25C14.7032 1.25 18.5833 5.1302 18.5833 9.91667Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </form>
    )
}