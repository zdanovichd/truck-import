'use client'
import styles from "./header.module.css";
import Image from "next/image";
import { useEffect } from 'react';

export default function Header() {

  useEffect(() => {
    const nav = document.querySelector('.site_nav');
    if (nav) {
      nav.classList.add('enhanced');
    }


    const submenus = nav.querySelectorAll(
      '.menu__item[data-has-children]'
    )
    const dropdowns = nav.querySelectorAll(
      '.menu__item[data-has-children] > .menu'
    )

    const icon = `
        <svg
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="menu__btn-icon"
        >
            <path d="M9 1L5 5L1 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>

    `

    // Находим подменю, заменяем в нём span на кнопку
    submenus.forEach((item) => {
      const dropdown = item.querySelector(':scope > .menu')
      dropdown.setAttribute('hidden', '')

      const button = item.querySelector(':scope > .menu__btn')

      button.innerHTML += icon

      button.addEventListener('click', function (e) {
        toggleDropdown(button, dropdown)
      })

      // Обрабатываем нажатие на Esc
      dropdown.addEventListener('keydown', (e) => {
        e.stopImmediatePropagation()

        if (e.keyCode === 27 && focusIsInside(dropdown)) {
          toggleDropdown(button, dropdown)
          button.focus()
        }
      }, false)
    })


function toggleDropdown(button, dropdown) {
  if (button.getAttribute('aria-expanded') === 'true') {
    button.setAttribute('aria-expanded', 'false')
    dropdown.setAttribute('hidden', '')
  } else {
    button.setAttribute('aria-expanded', 'true')
    dropdown.removeAttribute('hidden')
  }
}

function focusIsInside(element) {
  return element.contains(document.activeElement)
}

function collapseDropdownsWhenTabbingOutsideNav(e) {
  if (e.keyCode === 9 && !focusIsInside(nav)) {
    dropdowns.forEach(function (dropdown) {
      dropdown.setAttribute('hidden', '')
      const btn = dropdown.parentNode.querySelector('button')
      btn.setAttribute('aria-expanded', 'false')
    })
  }
}

function collapseDropdownsWhenClickingOutsideNav(e) {
  const target = e.target

  dropdowns.forEach(function (dropdown) {
    if (!dropdown.parentNode.contains(target)) {
      dropdown.setAttribute('hidden', '')
      const btn = dropdown.parentNode.querySelector('button')
      btn.setAttribute('aria-expanded', 'false')
    }
  });
}

// Закрываем навигацию, если протапались за её пределы
document.addEventListener('keyup', collapseDropdownsWhenTabbingOutsideNav)

// Закрываем навигацию, если кликнули вне навигации
window.addEventListener('click', collapseDropdownsWhenClickingOutsideNav)
}, []);
  return (
    <header className={styles.header}>
        <a className="logo" href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'calc(203vw/14.4)',
                height: 'auto',
              }}
              priority
            />
        </a>
        <nav
            className="site_nav"
            aria-label="Сайт"
        >
            <ul className="menu main__menu">
                <li className="menu__item" data-has-children>
                    <button
                        className="menu__btn"
                        aria-expanded="false"
                        aria-controls="catalog-submenu"
                    >
                        Каталог запчастей
                    </button>
                    <ul className="menu menu_submenu" id="catalog-submenu">
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="/catalog/mercedes"
                                aria-current="page"
                            >
                                Mercedes
                            </a>
                        </li>
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="/catalog/man"
                                aria-current="page"
                            >Man</a>
                        </li>
                        <li className="menu__item">
                            <a
                                className="menu__link"
                                href="/catalog/scania"
                                aria-current="page"
                            >Scania</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/volvo"
                                aria-current="page"
                            >Volvo</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/hengst"
                                aria-current="page"
                            >Hengst</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/kolbenschmidt"
                                aria-current="page"
                            >Kolbenschmidt</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/daf"
                                aria-current="page"
                            >Daf</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/iveco"
                                aria-current="page"
                            >Iveco</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/renault"
                                aria-current="page"
                            >Renault</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/febi"
                                aria-current="page"
                            >Febi</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/mahle"
                                aria-current="page"
                            >MAHLE</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/luk"
                                aria-current="page"
                            >Luk</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/oeg"
                                aria-current="page"
                            >OE Germany</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/webasto"
                                aria-current="page"
                            >Webasto</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/bosch"
                                aria-current="page"
                            >BOSCH</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="/catalog/zf"
                                aria-current="page"
                            >ZF</a>
                        </li>
                    </ul>
                </li>
                <li className="menu__item" data-has-children>
                    <button
                        className="menu__btn"
                        aria-expanded="false"
                        aria-controls="buyers-submenu"
                    >
                        Покупателям
                    </button>
                    <ul className="menu menu_submenu" id="buyers-submenu">
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Оплата и доставка</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Гарантия</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Контакты</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Сотрудничество</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Возврат</a>
                        </li>
                    </ul>
                </li>
                <li className="menu__item" data-has-children>
                    <button
                        className="menu__btn"
                        aria-expanded="false"
                        aria-controls="about-submenu"
                    >
                        О проекте
                    </button>
                    <ul className="menu menu_submenu" id="about-submenu">
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Документы</a>
                        </li>
                        <li className="menu__item" >
                            <a
                                className="menu__link"
                                href="#"
                                aria-current="page"
                            >Вакансии</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
        <button className={styles.header__button}>
            <Image
              src="/account-avatar.svg"
              alt="account-avatar"
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: '1.45vw',
                height: 'auto',
              }}
              priority
            />
            Вход/регистрация
        </button>
    </header>
  )
}