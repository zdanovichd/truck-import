import SectionTitle from '@/components/ui/SectionTitle/SectionTitle';
import styles from './page.module.css'
import Image from 'next/image';
import Breadcrumbs from '@/components/sections/Breadcrumbs/Breadcrumbs';

export async function generateMetadata() {
  return {
    title: 'Корзина - truck-import',
    description: 'Добавили нужные запчасти? Отлично! В корзине вы можете перепроверить артикулы, количество и сразу отправить заказ в работу — без задержек и сложностей.',
  };
}

export default async function Page() {

  return (
    <main>
      <section className={styles.cart__hero}>
        <h1 className={styles.cart__title}>
          Корзина
        </h1>
      </section>
      {/* <Breadcrumbs
        data={[
          { title: "Главная", path: "/" },
          { title: "Корзина" },
        ]}
      /> */}


    </main>
  );
}
