// import Image from "next/image";
import styles from "./category.module.css";
import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import Image from "next/image";
import Link from 'next/link';
import Reviews from "@/app/components/ui/Reviews/Reviews";
import Search from "@/app/components/ui/Search/Search";
import Faq from "@/app/components/sections/Faq/Faq";
import Feedback from "@/app/components/ui/Feedback/Feedback";

export default async function Category({ brand = [] }) {

    const subcategories = brand.subcategories;
  const first__place = brand.first__place;
  const second__place = brand.second__place;

  return (
    <main>
      <section className={styles.category__hero}>
        <h1 className={styles.category__title}>Запчасти для грузовиков {brand.name}</h1>
      </section>
      <section className={styles.subcategories}>
        <SectionTitle
          title={brand.subcat__title}
          align="left"
        />
            <div className={styles.subcategories__inner}>
              {subcategories.map((item, index) => (
                <Link
                  key={index}
                  href={`/catalog/${brand.slug}/${item.slug}`}
                  className={styles.subcategory}
                >
                  <Image
                    className={styles.subcategory__image}
                    // src={`/categories/${brand.slug}/${item.slug}/${brand.slug}-${item.slug}.png`}
                    src={'/7_0.jpg'}
                    alt={`${brand.name} ${item.name}`}
                    width={500} // дефолтное значение (для SSR)
                    height={300}
                    style={{
                      width: 'calc(353vw/14.4)',
                      height: 'calc(350vw/14.4)',
                      objectFit: 'cover',
                    }}
                  />
                  <p className={styles.subcategory__name}>Запчасти {brand.name} {item.name}</p>
                </Link>
              ))}
            </div>
      </section>
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
      <section className={styles.advantages}>
        <SectionTitle
          title="Преимущества для оптовых покупателей"
        />
        <div className={styles.advantages__inner}>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/select-category.svg'}
              alt={'select-category'}
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'auto',
                height: 'calc(87vw/14.4)',
              }}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Широкий ассортимент<br/>оригинальных и<br/>аналоговых запасных<br/>частей</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/vigoda-1.svg'}
              alt={'vigoda-1'}
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'auto',
                height: 'calc(87vw/14.4)',
              }}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Гарантия качества на все<br/>грузовые запчасти<br/>{brand.name}</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/delivery.svg'}
              alt={'delivery'}
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'auto',
                height: 'calc(87vw/14.4)',
              }}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Возможность быстро<br/>заказать запчасти с<br/>доставкой</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/support.svg'}
              alt={'support'}
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'auto',
                height: 'calc(87vw/14.4)',
              }}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Квалифицированная<br/>поддержка по подбору<br/>запчастей {brand.name}</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/mobile-payment.svg'}
              alt={'mobile-payment'}
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'auto',
                height: 'calc(87vw/14.4)',
              }}
            />
              <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Удобные способы оплаты<br/>и выгодные цены</p>
            </div>
          </div>
        </section>
        {first__place.map((item, index) => (
            <section className={styles.assortment} key={index}>
              <SectionTitle
                title={item[0]}
                align="left"
              />
              <div
                  className={styles.assortment__inner}
                  dangerouslySetInnerHTML={{ __html: item[1] }}
                >
              </div>
            </section>
              ))}
      <Reviews
        description={`Наши клиенты отмечают надежность и долговечность представленных запчастей на грузовики ${brand.name}. Многие владельцы грузовиков ${brand.name} доверяют нам, поскольку у нас всегда в наличии запасные части, соответствующие стандартам качества. Ознакомьтесь с фотографиями запчастей в нашем каталоге и сделайте правильный выбор!`}
      />
      <Faq
        title={brand.faq__title}
        data={brand.faq__data}
      />
        {second__place.map((item, index) => (
            <section className={styles.assortment} key={index}>
              <SectionTitle
                title={item[0]}
                align="left"
              />
              <div
                  className={styles.assortment__inner}
                  dangerouslySetInnerHTML={{ __html: item[1] }}
                >
              </div>
            </section>
              ))}
      <section className={styles.feedback}>
              <div className={styles.feedback__inner}>
                <SectionTitle
                  title={`Доставка запчастей для грузовиков ${brand.name} по Москве: условия и стоимость`}
                  align="left"
                  fontSize={32}
                />
                <div className={styles.feedback__content}>
                  <p>Мы предлагаем быструю доставку по Москве и всей России.</p>
                  <br/>
                  <ul>
                    <li>Доставка осуществляется в течение 1-2 дней при наличии товара на складе.</li>
                    <li>Возможен самовывоз из пункта выдачи.</li>
                    <li>Для оптовых покупателей действуют специальные условия.</li>
                  </ul>
                  <br/>
                  <p>Выберите нужную запчасть, оформите заказ и получите товар в кратчайшие сроки! Свяжитесь с нами для консультации и подбора необходимых деталей!</p>
                </div>
              </div>
              <Feedback />
      </section>
    </main>
  );
}