// import Image from "next/image";
import styles from "./page.module.css";
import data from '../../../../json/data.json';
import { notFound } from "next/navigation";
import Details from "@/app/components/sections/Details/Details";
import Search from "@/app/components/ui/Search/Search";
import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import Faq from "@/app/components/sections/Faq/Faq";
import Feedback from "@/app/components/ui/Feedback/Feedback";

export const dynamicParams = false;

// export async function generateStaticParams() {
//   return brands.map((brand) => ({
//     sub: brand.subcategories.slug, // Ключ должен совпадать с именем папки [slug]
//   }));
// }

export async function generateMetadata({ params }) {
  const { slug, sub } = await params
  const brands = data.brands;
  const brand = brands.find(brand => brand.slug === slug);
  if (!brand) {
    notFound();
  }
  const subcategories = brand.subcategories;
  const subcategory = subcategories.find(subcategory => subcategory.slug === sub);

  return {
    title: subcategory?.meta__title || 'Default Title',
    description: subcategory?.meta__description || 'Default Description',
  };
}

export default async function Page({ params }) {
  const { slug, sub } = await params
  const brands = data.brands;
  const brand = brands.find(brand => brand.slug === slug);
  if (!brand) {
    notFound();
  }
  const subcategories = brand.subcategories;
  const subcategory = subcategories.find(subcategory => subcategory.slug === sub);

  // console.log(subcategory.first__place);

    if (!subcategory) {
      notFound();
    }

  return (
    <main>
      <section className={styles.category__hero}>
        <h1 className={styles.category__title}>{subcategory.h1}</h1>
      </section>
      <Details
        sub={subcategory}
        data={brand}
      />
      <section className={styles.category__search}>
        <SectionTitle
            title="Как заказать запчасти для грузовиков в нашем магазине?"
        />
        <div className={styles.category__search__inner}>
          <p className={styles.category__search_description}>Чтобы найти нужную запчасть, воспользуйтесь удобным поиском по артикулу. Просто<br/>введите код детали в строку поиска, и система покажет наличие товара.</p>
          <Search />
          <p className={styles.category__search_mark}>*Для оформления заказа требуется регистрация в личном кабинете. После авторизации<br/>введите артикул или загрузите таблицу с кодами и количеством товаров. После подтверждения<br/>вам будет выставлен счёт. Оплата возможна различными способами, включая оптовый расчёт.<br/>После обработки заказа можно отслеживать его статус в личном кабинете. Доставка<br/>осуществляется по всей России.</p>
        </div>
      </section>
      <section className={`${styles.assortment} ${styles.assortment_row}`}>
        <div className={styles.assortment__wrapper}>
          <SectionTitle
            title={subcategory.first__place[0][0]}
            align="left"
            fontSize={32}
          />
          <div
            className={styles.assortment__inner}
            dangerouslySetInnerHTML={{ __html: subcategory.first__place[0][1] }}
          >
          </div>
        </div>
        <div className={styles.assortment__wrapper}>
          <SectionTitle
            title={subcategory.first__place[1][0]}
            align="left"
            fontSize={32}
          />
          <div
            className={styles.assortment__inner}
            dangerouslySetInnerHTML={{ __html: subcategory.first__place[1][1] }}
          >
          </div>
        </div>
      </section>
      <section className={styles.assortment}>
        <SectionTitle
          title={subcategory.first__place[2][0]}
          align="left"
          fontSize={32}
        />
        <div
          className={styles.assortment__inner}
          dangerouslySetInnerHTML={{ __html: subcategory.first__place[2][1] }}
        >
        </div>
      </section>
      <Faq
        title={subcategory.faq__title}
        data={subcategory.faq__data}
      />
      <section className={`${styles.assortment} ${styles.assortment_row}`}>
        <div className={styles.assortment__wrapper}>
          <SectionTitle
            title={subcategory.second__place[0][0]}
            align="left"
            fontSize={32}
          />
          <div
            className={styles.assortment__inner}
            dangerouslySetInnerHTML={{ __html: subcategory.second__place[0][1] }}
          >
          </div>
        </div>
        <div className={styles.assortment__wrapper}>
          <SectionTitle
            title={subcategory.second__place[1][0]}
            align="left"
            fontSize={32}
          />
          <div
            className={styles.assortment__inner}
            dangerouslySetInnerHTML={{ __html: subcategory.second__place[1][1] }}
          >
          </div>
        </div>
      </section>
      <section className={styles.assortment}>
        <SectionTitle
          title={subcategory.second__place[2][0]}
          align="left"
          fontSize={32}
        />
        <div
          className={styles.assortment__inner}
          dangerouslySetInnerHTML={{ __html: subcategory.second__place[2][1] }}
        >
        </div>
      </section>

      <section className={styles.feedback}>
              <div className={styles.feedback__inner}>
                <SectionTitle
                  title={`Доставка запчастей по Москве: условия и стоимость`}
                  align="left"
                  fontSize={32}
                />
                <div className={styles.feedback__content}>
                  <p>Мы предлагаем быструю доставку по Москве и Московской области. Возможны разные способы получения товаров:</p>
                  <br/>
                  <ul>
                    <li>Самовывоз из нашего склада.</li>
                    <li>Доставка курьером по Москве.</li>
                    <li>Отправка транспортной компанией по всей России.</li>
                  </ul>
                </div>
              </div>
              <Feedback />
      </section>
    </main>
  );
}