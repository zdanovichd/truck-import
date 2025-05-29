'use client'
import styles from "./header.module.css";
import Image from "next/image";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Search from "../../ui/Search/Search";
const menuItems = [
  {
    title: "Каталог запчастей",
    name: "catalog",
    items: [
      { name: "Mercedes", href: "/catalog/mercedes" },
      { name: "Man", href: "/catalog/man" },
      { name: "Scania", href: "/catalog/scania" },
      { name: "Volvo", href: "/catalog/volvo" },
      { name: "Hengst", href: "/catalog/hengst" },
      { name: "Kolbenschmidt", href: "/catalog/kolbenschmidt" },
      { name: "Daf", href: "/catalog/daf" },
      { name: "Iveco", href: "/catalog/iveco" },
      { name: "Renault", href: "/catalog/renault" },
      { name: "Valeo", href: "/catalog/valeo" },
      { name: "MAHLE", href: "/catalog/mahle" },
      { name: "FPT", href: "/catalog/fpt" },
      { name: "OE Germany", href: "/catalog/oeg" },
      { name: "Liebherr", href: "/catalog/liebherr" },
      { name: "KORTEX", href: "/catalog/kortex" },
      { name: "ZF", href: "/catalog/zf" },
      { name: "Victor Reinz", href: "/catalog/victor-reinz" },
      { name: "John Deere", href: "/catalog/john-deere" },
      { name: "Komatsu", href: "/catalog/komatsu" },
      { name: "Iveco Daily", href: "/catalog/iveco-daily" },
      { name: "KS-AUTO", href: "/catalog/ks-auto" },
      { name: "BF/CS Germany", href: "/catalog/bf-cs-germany" },
    ]
  },
  {
    title: "Покупателям",
    name: "buyers",
    items: [
      { name: "Оплата и доставка", href: "#" },
      { name: "Гарантия", href: "#" },
      { name: "Контакты", href: "#" },
      { name: "Сотрудничество", href: "#" },
      { name: "Возврат", href: "#" }
    ]
  },
  {
    title: "О проекте",
    name: "about",
    items: [
      { name: "Документы", href: "#" },
      { name: "Вакансии", href: "#" }
    ]
  }
];

const arrowIcon = `
  <svg
    width="10"
    height="7"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="menu__btn-icon"
  >
    <path d="M9 1L5 5L1 1" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [burgerActive, setBurgerActive] = useState(false);
  const isMobileRef = useRef(false);
  const handleResize = () => {
    isMobileRef.current = window.innerWidth < 768;
    setIsMobile(isMobileRef.current);

    // console.log(window.innerWidth);
    // console.log(isMobileRef.current);


  }

  useEffect(() => {
    handleResize();
    let nav;
    if (isMobileRef.current) {
      nav = document.querySelector('.site_nav_mobile');
      // console.log('nav_m', nav);
    } else {
      nav = document.querySelector('.site_nav');
      // console.log('nav', nav);
    }
    if (!nav) return;



    nav.classList.add('enhanced');
    const submenus = nav.querySelectorAll('.menu__item[data-has-children]');

    const toggleDropdown = (button, dropdown, submenus) => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Сначала закрываем все
        submenus.forEach(item => {
            const otherDropdown = item.querySelector('.menu');
            const otherButton = item.querySelector('.menu__btn');
            otherDropdown.setAttribute('hidden', '');
            otherButton.setAttribute('aria-expanded', 'false');
        });

        // Открываем текущий, если он не был уже открыт
        if (!isExpanded) {
            button.setAttribute('aria-expanded', 'true');
            dropdown.removeAttribute('hidden');
        }
    };

    const handleClickOutside = (e) => {
        submenus.forEach(item => {
            const dropdown = item.querySelector('.menu');
            const button = item.querySelector('.menu__btn');
            if (!item.contains(e.target)) {
            dropdown.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
            }
        });
    };

    submenus.forEach((item) => {
        const dropdown = item.querySelector('.menu');
        const button = item.querySelector('.menu__btn');

        dropdown.setAttribute('hidden', '');
        button.innerHTML += arrowIcon;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(button, dropdown, submenus); // передаём submenus
        });

        dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
            toggleDropdown(button, dropdown);
            button.focus();
            }
        });
        const links = dropdown.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
            dropdown.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
            });
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !nav.contains(document.activeElement)) {
            submenus.forEach(item => {
                const dropdown = item.querySelector('.menu');
                const button = item.querySelector('.menu__btn');
                dropdown.setAttribute('hidden', '');
                button.setAttribute('aria-expanded', 'false');
            });
        }
    });

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('click', handleClickOutside);
    };

  }, []);
  const phoneNumbers = useMemo(() => [
        { number: "+7 (900) 604-46-14", href: "tel:+79006044614" },
        { number: "+7 (909) 913-11-86", href: "tel:+79099131186" }
  ], []);

  // console.log(burgerActive)
  return (

    <>
      {isMobile && (
        <header className={`${styles.header} ${styles._mobile} ${burgerActive ? '_opened' : ''}`}>
          <div className={styles.burger}>
            <button
              className={`${styles.burger__inner} ${burgerActive ? styles._active : ''}`}
              onClick={() => {
                setBurgerActive(!burgerActive);
                let elem = document.querySelector('body');
                elem.classList.toggle('stop-scrolling');
                }}
            >
              <span className={styles.burger__item}></span>
              <span className={styles.burger__item}></span>
              <span className={styles.burger__item}></span>
            </button>
          </div>
          <Link className="logo" href="/" passHref>
            <Image
              src="/logo.svg"
              alt="logo"
              width={500}
              height={300}
              style={{
                width: 'auto',
                height: 'calc(29vw/3.9)',
              }}
              priority
            />
          </Link>
          <div className={styles.header__buttons}>
                <button className={styles.header__account} aria-label="Аккаунт">
                  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.85938 10.2855C5.85938 13.9379 8.84766 16.9261 12.5 16.9261C16.1523 16.9261 19.1406 13.9379 19.1406 10.2855C19.1406 6.63318 16.1523 3.6449 12.5 3.6449C8.84766 3.6449 5.85938 6.63318 5.85938 10.2855ZM17.5781 10.2855C17.5781 13.0785 15.293 15.3636 12.5 15.3636C9.70703 15.3636 7.42188 13.0785 7.42188 10.2855C7.42188 7.49255 9.70703 5.2074 12.5 5.2074C15.293 5.2074 17.5781 7.49255 17.5781 10.2855Z" fill="#C9AC37"/>
                    <path d="M4.76562 22.5251C6.83594 20.4548 9.57031 19.322 12.5 19.322C15.4297 19.322 18.1641 20.4548 20.2344 22.5251L21.3477 21.4118C18.9844 19.0681 15.8398 17.7595 12.5 17.7595C9.16016 17.7595 6.01563 19.0681 3.65234 21.4118L4.76562 22.5251Z" fill="#C9AC37"/>
                  </svg>
                </button>

                <button className={styles.header__button} aria-label="Корзина">
                  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_199_680)">
                      <path d="M24.7961 7.29121C24.6508 7.08496 24.414 6.96152 24.1617 6.96152H7.58124L6.32577 2.6334C5.83358 0.928711 4.66405 0.745117 4.18436 0.745117H0.837488C0.408582 0.745117 0.0617065 1.09277 0.0617065 1.5209C0.0617065 1.94902 0.409363 2.29668 0.837488 2.29668H4.18358C4.28983 2.29668 4.61249 2.29668 4.8328 3.05762L9.15077 18.9256C9.24452 19.26 9.54999 19.4912 9.89764 19.4912H20.4437C20.7711 19.4912 21.0633 19.2865 21.1734 18.9779L24.8906 7.99902C24.9766 7.76152 24.9406 7.49668 24.7953 7.29043L24.7961 7.29121ZM19.8984 17.9404H10.4875L8.01796 8.51387H23.0594L19.8984 17.9404ZM18.3594 21.0639C17.2805 21.0639 16.4062 21.9381 16.4062 23.017C16.4062 24.0959 17.2805 24.9701 18.3594 24.9701C19.4383 24.9701 20.3125 24.0959 20.3125 23.017C20.3125 21.9381 19.4383 21.0639 18.3594 21.0639ZM11.3281 21.0639C10.2492 21.0639 9.37499 21.9381 9.37499 23.017C9.37499 24.0959 10.2492 24.9701 11.3281 24.9701C12.407 24.9701 13.2812 24.0959 13.2812 23.017C13.2812 21.9381 12.407 21.0639 11.3281 21.0639Z" fill="black"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_199_680">
                        <rect width="25" height="25" fill="white" transform="translate(0 0.357605)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
          <div
            className={`${styles.burger__content} ${burgerActive ? styles._active : ''}`}
          >
            <Search/>
            <nav className="site_nav_mobile" aria-label="Сайт">
                <ul className="menu main__menu">
                  {menuItems.map((section, index) => (
                    <li key={index} className="menu__item" data-has-children>
                      <button
                        className="menu__btn"
                        aria-expanded="false"
                        aria-controls={`${section.name.toLowerCase().replace(/\s+/g, '-')}-submenu`}
                        aria-label={section.name}
                      >
                        {section.title}
                      </button>
                      <ul className="menu menu_submenu" id={`${section.name.toLowerCase().replace(/\s+/g, '-')}-submenu`} hidden>
                        {section.items.map((item, i) => (
                          <li key={i} className="menu__item">
                            <Link
                              className="menu__link"
                              href={item.href}
                              aria-current="page"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
          </div>
        </header>
      )}
      {!isMobile && (
        <header className={`${styles.header} ${styles._desktop}`}>


            <div className={styles.header__top}>
              <Link className="logo" href="/" passHref>
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={500}
                  height={300}
                  style={{
                    width: 'calc(145vw/14.4)',
                    height: 'auto',
                  }}
                  priority
                />
              </Link>

              <div className={styles.header__inner}>
                <div className={styles.header__item}>
                  <Link className={styles.header__phone} href={phoneNumbers[0].href}>
                    {phoneNumbers[0].number}
                  </Link>
                  <Link className={styles.header__feedback} href="#">
                    Заказать звонок
                  </Link>
                </div>

                <div className={styles.header__item}>
                  <Link className={styles.header__phone} href={phoneNumbers[1].href}>
                    {phoneNumbers[1].number}
                  </Link>
                  <p className={styles.header__working_hours}>Пн-Пт: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
            <div className={styles.header__bottom}>
              <nav className="site_nav" aria-label="Сайт">
                <ul className="menu main__menu">
                  {menuItems.map((section, index) => (
                    <li key={index} className="menu__item" data-has-children>
                      <button
                        className="menu__btn"
                        aria-expanded="false"
                        aria-controls={`${section.name.toLowerCase().replace(/\s+/g, '-')}-submenu`}
                        aria-label={section.name}
                      >
                        {section.title}
                      </button>
                      <ul className="menu menu_submenu" id={`${section.name.toLowerCase().replace(/\s+/g, '-')}-submenu`} hidden>
                        {section.items.map((item, i) => (
                          <li key={i} className="menu__item">
                            <Link
                              className="menu__link"
                              href={item.href}
                              aria-current="page"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className={styles.header__buttons}>
                <button className={styles.header__account} aria-label="Аккаунт">
                  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.85938 10.2855C5.85938 13.9379 8.84766 16.9261 12.5 16.9261C16.1523 16.9261 19.1406 13.9379 19.1406 10.2855C19.1406 6.63318 16.1523 3.6449 12.5 3.6449C8.84766 3.6449 5.85938 6.63318 5.85938 10.2855ZM17.5781 10.2855C17.5781 13.0785 15.293 15.3636 12.5 15.3636C9.70703 15.3636 7.42188 13.0785 7.42188 10.2855C7.42188 7.49255 9.70703 5.2074 12.5 5.2074C15.293 5.2074 17.5781 7.49255 17.5781 10.2855Z" fill="#C9AC37"/>
                    <path d="M4.76562 22.5251C6.83594 20.4548 9.57031 19.322 12.5 19.322C15.4297 19.322 18.1641 20.4548 20.2344 22.5251L21.3477 21.4118C18.9844 19.0681 15.8398 17.7595 12.5 17.7595C9.16016 17.7595 6.01563 19.0681 3.65234 21.4118L4.76562 22.5251Z" fill="#C9AC37"/>
                  </svg>
                </button>

                <button className={styles.header__button} aria-label="Корзина">
                  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_199_680)">
                      <path d="M24.7961 7.29121C24.6508 7.08496 24.414 6.96152 24.1617 6.96152H7.58124L6.32577 2.6334C5.83358 0.928711 4.66405 0.745117 4.18436 0.745117H0.837488C0.408582 0.745117 0.0617065 1.09277 0.0617065 1.5209C0.0617065 1.94902 0.409363 2.29668 0.837488 2.29668H4.18358C4.28983 2.29668 4.61249 2.29668 4.8328 3.05762L9.15077 18.9256C9.24452 19.26 9.54999 19.4912 9.89764 19.4912H20.4437C20.7711 19.4912 21.0633 19.2865 21.1734 18.9779L24.8906 7.99902C24.9766 7.76152 24.9406 7.49668 24.7953 7.29043L24.7961 7.29121ZM19.8984 17.9404H10.4875L8.01796 8.51387H23.0594L19.8984 17.9404ZM18.3594 21.0639C17.2805 21.0639 16.4062 21.9381 16.4062 23.017C16.4062 24.0959 17.2805 24.9701 18.3594 24.9701C19.4383 24.9701 20.3125 24.0959 20.3125 23.017C20.3125 21.9381 19.4383 21.0639 18.3594 21.0639ZM11.3281 21.0639C10.2492 21.0639 9.37499 21.9381 9.37499 23.017C9.37499 24.0959 10.2492 24.9701 11.3281 24.9701C12.407 24.9701 13.2812 24.0959 13.2812 23.017C13.2812 21.9381 12.407 21.0639 11.3281 21.0639Z" fill="black"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_199_680">
                        <rect width="25" height="25" fill="white" transform="translate(0 0.357605)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  Корзина
                </button>
              </div>
            </div>
        </header>
      )}
    </>

  )
}

