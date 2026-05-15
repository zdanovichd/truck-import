'use client';

import styles from './cartAuthChoiceModal.module.css';

/**
 * Неавторизован: оформление заказа — выбор между SSO и оставаться на странице.
 */
export default function CartAuthChoiceModal({ open, onClose, description }) {
  if (!open) return null;

  const next =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/cart';
  const ssoHref = `/auth/sso?next=${encodeURIComponent(next)}`;

  const text =
    description ||
    'Войдите в личный кабинет, чтобы добавлять товары в корзину и оформлять заказы. Или продолжите просмотр без входа.';

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-auth-choice-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cart-auth-choice-title" className={styles.title}>
          Вход в аккаунт
        </h2>
        <p className={styles.text}>{text}</p>
        <div className={styles.actions}>
          <a className={styles.toAuth} href={ssoHref}>
            Перейти к авторизации
          </a>
          <button type="button" className={styles.continueBtn} onClick={onClose}>
            Продолжить просмотр
          </button>
        </div>
      </div>
    </div>
  );
}
