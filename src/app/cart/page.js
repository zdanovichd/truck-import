import { Suspense } from 'react';
import CartClient from './CartClient';
import styles from './page.module.css';

export async function generateMetadata() {
  return {
    title: 'Корзина - truck-import',
    description:
      'Добавили нужные запчасти? Отлично! В корзине вы можете перепроверить артикулы, количество и сразу отправить заказ в работу — без задержек и сложностей.',
  };
}

export default function CartPage() {
  return (
    <main>
      <section className={styles.cart__hero}>
        <h1 className={styles.cart__title}>Корзина</h1>
      </section>
      <section className={styles.cart__content}>
        <Suspense fallback={<p>Загрузка корзины...</p>}>
          <CartClient />
        </Suspense>
      </section>
    </main>
  );
}
