import SectionTitle from '@/components/ui/SectionTitle/SectionTitle';
import styles from './page.module.css'
import Image from 'next/image';

export async function generateMetadata() {
    return {
      title: 'Условия оплаты и доставки в компании truck-import',
      description: 'Условия оплаты и доставки в компании truck-import. Мы предлагаем удобные способы оплаты и надежную доставку по России. Выберите подходящий способ при оформлении заказа',
    };
}

export default async function Page() {

  return (
    <main>
      <section className={styles.oplata__hero}>
        <h1 className={styles.oplata__title}>
          Оплата и доставка
        </h1>
      </section>

      <section className={styles.oplata__content}>

        <h2 className={styles.oplata__h2}>Способы доставки</h2>
        <div className={styles.main__text}>
          <ol>
            <li>
              Самовывоз: 111625, Москва, Каскадная улица, 20к2, пом.1
            </li>
            <br/>
            <li> ⁠Доставка почтой, СДЕК, доставка любой ТК, авиадоставка по всей России</li>
          </ol>
          <br/>
          <p>Время доставки зависит от выбранного способа доставки и конечного пункта и может составлять от 3  до 90 дней.</p>
        </div>
        <p className={styles.text__left_border}><b>Стоимость доставки:</b> расчет стоимости доставки определяется непосредственно во время оформления груза</p>
      </section>

      <section className={styles.advantages}>
        <SectionTitle
          title="Способы оплаты"
        />
        <p className={styles.advantages__subtitle}>Во время оформления заказа обязательно составляем договор, предоплата<br/>составляет от 50%-100% в зависимости от условий договора.</p>
        <div className={styles.advantages__inner}>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/select-category.svg'}
              alt={'select-category'}
              width={500} // дефолтное значение (для SSR)
              height={300}

            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Наличными</p>
            <p className={styles.advantages__subtext}>Оплата товара<br/>наличными в момент<br/>получения или в<br/>магазине</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/vigoda-1.svg'}
              alt={'vigoda-1'}
              width={500} // дефолтное значение (для SSR)
              height={300}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Картой в пункте<br/>самовывоза</p>
            <p className={styles.advantages__subtext}>Расчёт банковской<br/>картой при покупке в<br/>пункте самовывоза</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/delivery.svg'}
              alt={'delivery'}
              width={500} // дефолтное значение (для SSR)
              height={300}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>На расчетный счет</p>
            <p className={styles.advantages__subtext}>Перевод средств на<br/>реквизиты компании,<br/>указанные в счёте</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/support.svg'}
              alt={'support'}
              width={500} // дефолтное значение (для SSR)
              height={300}
            />
            <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Картой курьеру</p>
            <p className={styles.advantages__subtext}>Оплата картой при<br/>доставке товара на<br/>дом</p>
          </div>
          <div className={styles.advantages__item}>
            <Image
              className={styles.advantages__image}
              src={'/mobile-payment.svg'}
              alt={'mobile-payment'}
              width={500} // дефолтное значение (для SSR)
              height={300}
            />
              <p className={`${styles.advantages__text} ${styles.advantages__text_small}`}>Переводом на карту</p>
              <p className={styles.advantages__subtext}>Отправка денег на<br/>указанную банковскую<br/>карту получателя</p>
            </div>
          </div>
        </section>
    </main>
  );
}
