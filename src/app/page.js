import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";
import Search from "./components/ui/Search/Search";
import Brands from "./components/ui/Brands/Brands";
import Advantages from "./components/sections/Advantages/Advantages";
import SectionTitle from "./components/ui/SectionTitle/SectionTitle";
import Reviews from "./components/ui/Reviews/Reviews";

export async function generateMetadata() {
  return {
    title: "Грузовые запчасти оптом в Москве | truck-import.ru",
    description: "Запчасти для грузовых автомобилей оптом в Москве. Продажа оригинальных и аналоговых запчастей для MAN, MERCEDES, VOLVO, DAF, SCANIA, IVECO, и других марок. Гибкие условия, быстрая доставка, проверенные поставщики. Мы предлагаем надежные запчасти для вашего бизнеса!",
  }
}


export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>Грузовые запчасти оптом</h1>
        <div className={styles.search}>
          <Search
            // style={{ marginBottom: 'calc(117vw / 14.4)' }}
          />
        </div>
        <Brands
          brands={["scania", "daf", "volvo", "mercedes", "man"]}
          theme="gray"
        />
      </section>
      <Advantages
        advantages={[
          ["vigoda-1", "Регистрируйся <br> на сайте"],
          ["vigoda-2", "Получай персональные<br>скидки на продукцию"],
          ["vigoda-4", "Веди учет всех операций<br>в личном кабинете"],
          ["vigoda-3", "Контролируй<br>статус заказа"],
        ]}
        // advantagesText="small"
      />
      <section className={styles.spares}>
        <SectionTitle
          title="Запчасти для грузовых автомобилей"
          align="center"
        />
        <div className={styles.spares__inner}>
          <Brands
            brands={["man", "daf", "mercedes", "scania", "volvo"]}
          />
          <Brands
            brands={["fag", "ina", "febi", "hengst"]}
          />
          <Brands
            brands={["kolbenschmidt", "mahle", "luk", "oeg", "webasto"]}
          />
          <Brands
            brands={["bosch", "brembo", "zf"]}
          />
          {/* <Brands
            brands={["holset", "jost", "knorr-bremse", "monroe"]}
          />
          <Brands
            brands={["garrett", "gf", "hella"]}
          />
          <Brands
            brands={["behr", "beral", "dayco", "delphi", "fedoro"]}
          />
          <Brands
            brands={["skf", "textar", "trw", "wabco"]}
          /> */}
        </div>
      </section>
      <section className={styles.assortment}>
        <SectionTitle
          title="Широкий ассортимент"
          align="left"
        />
            <p className="text">
                Наша компания готова предложить широкий ассортимент запчастей для грузовиков, включая тормозную систему, амортизаторы, диски, элементы кабины и многое другое. Мы сотрудничаем с проверенными поставщиками запчастей для грузовых автомобилей по оптовым ценам, чтобы обеспечить наличие товара на складе в разных городах России. Благодаря прямым контактам с брендами, мы поддерживаем конкурентоспособные цены и регулярно обновляем каталог новыми поступлениями.
                  <br/><br/>
                Вся продукция сертифицирована, и мы гарантируем высокий уровень качества каждой детали. Независимо от того, какой запрос вы оставите на сайте или какую позицию ищете через поиск, наши специалисты оперативно свяжутся с вами, чтобы помочь найти нужное наименование. Мы предлагаем как оригинальные запасные части, так и аналоги, которые являются надежным решением для коммерческого транспорта, включая полуприцепы и технику HOWO.
            </p>
      </section>
      <section className={styles.opt}>
        <SectionTitle
          title="Оптовая продажа запчастей для грузовиков"
          align="left"
        />
            <div className={styles.opt__inner}>
                <p className="text">Оптовая продажа запчастей для грузовиков — это одно из ключевых направлений нашей деятельности. Мы приглашаем к сотрудничеству магазины грузовых запчастей, оптовых покупателей и других партнеров, заинтересованных во взаимовыгодном сотрудничестве. Наша компания уже много лет работает на рынке автозапчастей и зарекомендовала себя как надежного партнера для клиентов, которые ценят качество, низкую цену и оперативность в отправке товара.</p>
                <p className="text">У нас представлен большой ассортимент оригинальных запчастей и их аналогов, что позволяет удовлетворить потребности даже самых требовательных клиентов. В наличии запчасти различных брендов, включая системы тормозной безопасности, задние фонари, комплектующие для кабины и многое другое. Если вы хотите заказать товар оптом, просто укажите номер телефона или оставьте запрос на сайте — отдел оптовых продаж свяжется с вами, чтобы обсудить условиями сотрудничества.</p>
            </div>
            <p className="text">
                Мы предлагаем уникальные возможности для тех, кто ищет качественные запчасти оптом в Москве и по всей РФ. Наша база данных содержит информацию о наличии товара, его кодах и характеристиках, что делает поиск удобным и быстрым. Мы регулярно обновляем прайс-лист, чтобы предоставить актуальные данные о ценах и новых поступлениях.
                <br/><br/>
                Предлагаем не только стандартный набор грузовых запчастей, но и редкие позиции, которые сложно найти в фирменных магазинах или у других оптовых компаний. Это позволяет нам быть лидерами в своей нише и поддерживать большую клиентскую базу. Каждый клиент может рассчитывать на индивидуальный подход, официальные сертификаты качества и плодотворного сотрудничества.
            </p>
      </section>
      <Reviews />
      <section className={styles.articles}>
            <SectionTitle
              title="Новости и обновления"
              align="left"
            />
            <div className={styles.articles__inner}>
                <article className={`${styles.article} ${styles.article_preview}`}>

                    <Link className={styles.article__link} href="#">
                        <p className={styles.article__meta}>02.06.2023</p>
                        <h3 className={`${styles.article__title} ${styles.article__title_small}`}>Пополнение каталога запчастей на MAN</h3>
                        <p className={styles.article__content}>Более 7000 новых запчастей в нашем каталоге MAN. Запчасти для грузовых автомобилей доступны к заказу уже сегодня с доставкой по всему миру</p>
                    </Link>
                </article>
                <article className={`${styles.article} ${styles.article_preview}`}>
                    <Link className={styles.article__link} href="#">
                        <p className={styles.article__meta}>02.06.2023</p>
                        <h3 className={`${styles.article__title} ${styles.article__title_small}`}>Самый большой каталог запчастей для грузовых автомобилей</h3>
                        <p className={styles.article__content}>В нашем каталоге более 300 000 запчастей для MAN, Scania, Volvo, Mercedes-Benz, DAF и другие. Новые, оригинальные запчасти от производителей с гарантией и доставкой по всему миру</p>
                    </Link>
                </article>
                <article className={`${styles.article} ${styles.article_preview}`}>
                    <Link className={styles.article__link} href="#">
                        <p className={styles.article__meta}>02.06.2023</p>
                        <h3 className={`${styles.article__title} ${styles.article__title_small}`}>Новые функции на нашей платформе для заказа запчастей</h3>
                        <p className={styles.article__content}>Регистрируйтесь и начинайте заказывать запчасти для грузовых автомобилей полностью онлайн. Отслеживайте процесс доставки/оплаты и получайте быструю консультацию от менеджеров</p>
                    </Link>
                </article>
            </div>
        </section>
    </main>
  )
}
