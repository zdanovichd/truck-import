'use client'
import styles from "./footer.module.css";
import Image from "next/image";

export default function Footer() {

  return (
    <footer className={styles.footer}>
        <a className="logo" href="/">
            {/* <img src="/img/logo.svg" alt="logo"> */}
            <Image
              src="/logo.svg"
              alt="logo"
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'calc(291vw/14.4)',
                height: 'auto',
              }}
              priority
            />
        </a>
        <div className={styles.footer__item}>
            <div className={styles.phones}>
                <a className={styles.phones__item} href="tel:+79099131186">+7 (909) 913-11-86</a>
                <a className={styles.phones__item} href="tel:+79006044614">+7 (900) 604-46-14</a>
            </div>
            <div className={styles.footer__nav}>
                <nav
                    className="site_nav"
                    aria-label="Сайт"
                >
                    <ul className="menu menu_vertical">
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >
                                Оплата и доставка
                            </a>
                        </li>
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >
                                Гарантия
                            </a>
                        </li>
                    </ul>
                </nav>
                <nav
                    className="site_nav"
                    aria-label="Сайт"
                >
                    <ul className="menu menu_vertical">
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >
                                Каталог запчастей
                            </a>
                        </li>
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >
                                О проекте
                            </a>
                        </li>
                    </ul>
                </nav>
                <nav
                    className="site_nav"
                    aria-label="Сайт"
                >
                    <ul className="menu menu_vertical">
                    <li className="menu__item">
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >
                                Блог
                            </a>
                        </li>
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >
                                Контакты
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div className={`${styles.footer__item} ${styles.footer__item_bottom}`}>
            <div className={styles.footer__inner}>
                <div className={styles.footer__contacts}>
                    <a className={styles.footer__contact} href="mailto:import-aa@mail.ru">
                        {/* <img src="/img/mail.svg" alt="mail"> */}
                        <Image
                              src="/mail.svg"
                              alt="mail"
                              width={500} // дефолтное значение (для SSR)
                              height={300}
                              style={{
                                width: 'calc(32vw/14.4)',
                                height: 'calc(32vw/14.4)',
                              }}
                              priority

                            />
                        import-aa@mail.ru
                        </a>
                    <a className={styles.footer__contact} href="#">
                        {/* <img src="/img/location.svg" alt="location"> */}
                        <Image
                              src="/location.svg"
                              alt="location"
                              width={500} // дефолтное значение (для SSR)
                              height={300}
                              style={{
                                width: 'calc(32vw/14.4)',
                                height: 'calc(32vw/14.4)',
                              }}
                              priority
                            />
                        МО, городской округ Люберцы, рп. Октябрьский, ул. Ленина д.41
                    </a>
                </div>
                <div className={styles.footer__socials}>
                    <p className={styles.footer__socials_title}>
                        Мы в соцсетях
                    </p>
                    <div className={styles.footer__socials_inner}>
                        <a className={styles.footer__social} href="#">
                          <Image
                            src="/whatsapp.svg"
                            alt="whatsapp"
                            width={500} // дефолтное значение (для SSR)
                            height={300}
                            style={{
                              width: 'calc(32vw/14.4)',
                              height: 'calc(32vw/14.4)',
                            }}
                            priority
                          />
                            {/* <img src="/img/whatsapp.svg" alt="whatsapp"> */}
                        </a>
                        <a className={styles.footer__social} href="#">
                            {/* <img src="/img/telegram.svg" alt="telegram"> */}
                            <Image
                              src="/telegram.svg"
                              alt="telegram"
                              width={500} // дефолтное значение (для SSR)
                              height={300}
                              style={{
                                width: 'calc(32vw/14.4)',
                                height: 'calc(32vw/14.4)',
                              }}
                              priority
                            />
                        </a>
                    </div>
                </div>
            </div>
            <a className={styles.footer__privacy} href="#">Политика конфиденциальности</a>
        </div>
    </footer>
  )
}