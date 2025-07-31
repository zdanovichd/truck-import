import styles from "./productaddtocart.module.css";
import Image from "next/image";

export default function ProductAddToCartServer({ props_count = 0 }) {
  return (
    <div className={`${styles.cart__button} ${styles.cart__button_add}`} id="add-to-cart-button">
      {props_count > 0 ? (
        <button
          className={styles.cart__button_enabled}
           // Добавляем ID для гидрации
        >
          <Image
            src="/cart.svg"
            alt="cart"
            className={styles.cart__icon}
            width={20}
            height={20}
          />
          Добавить в корзину
        </button>
      ) : (
        <button className={styles.cart__button_disabled} disabled>
          Нет в наличии
        </button>
      )}
    </div>
  );
}