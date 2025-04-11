// import Image from "next/image";
import styles from "./page.module.css";
import brands from './data.json';
// 'use server'

// console.log(data);

// const brands = [
//   {
//     h1: "Запчасти для грузовиков Mercedes",
//     title: 'Запчасти для грузовиков Мерседес купить в Москве с доставкой',
//     description: 'Купить запчасти для грузовых автомобилей Mercedes по выгодным ценам с доставкой по всей России. В наличии оригинальные и аналоговые детали для Actros, Atego, Axor. Мы подбираем по артикулу, работаем с проверенными производителями и гарантируем качество!',
//     slug: 'mercedes',
//     name: 'Mercedes',
//   },
//   {
//     h1: "Запчасти для грузовиков MAN",
//     title: 'Каталог запчастей MAN (МАН) – купить автозапчасти в интернет-магазине, лучшие цены',
//     description: 'Купить запчасти MAN (МАН) по выгодным ценам – каталог автозапчастей для TGA, TGL, TGX, TGS. В наличии оригинальные и аналоговые детали. Можно заказать с доставкой в интернет-магазине',
//     slug: 'man',
//     name: 'MAN',
//   },
//   {
//     h1: "Запчасти для грузовиков Scania",
//     title: 'Каталог запчастей для грузовиков Scania (Скания) - купить онлайн в Москве с доставкой',
//     description: 'Каталог запчастей для грузовиков Scania (Скания). Оригинальные и качественные детали в наличии. Быстрая доставка по всей России. В наличии оригинальные и аналоговые детали для Scania 3-serie, 4-serie, 5-serie, 6-serie. Удобный заказ онлайн. Подберите все необходимое для ремонта и обслуживания вашего грузовика! ',
//     slug: 'scania',
//     name: 'Scania',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'volvo',
//     name: 'Volvo',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'hengst',
//     name: 'Hengst',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'kolbenschmidt',
//     name: 'Kolbenschmidt',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'daf',
//     name: 'Daf',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'iveco',
//     name: 'Iveco',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'renault',
//     name: 'Renault',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'febi',
//     name: 'Febi',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'mahle',
//     name: 'MAHLE',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'luk',
//     name: 'Luk',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'oeg',
//     name: 'OE Germany',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'webasto',
//     name: 'Webasto',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'bosch',
//     name: 'BOSCH',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'zf',
//     name: 'ZF',
//   },
//   {
//     h1: "h1",
//     title: 'title',
//     description: 'description',
//     slug: 'brembo',
//     name: 'Brembo',
//   },
// ];
export const dynamicParams = false;

export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.slug, // Ключ должен совпадать с именем папки [slug]
  }));
}

export async function generateMetadata({ params }) {
  const brand = brands.find(brand => brand.slug === params.slug);

  return {
    title: brand?.title || 'Default Title',
    description: brand?.description || 'Default Description',
  };
}

export default function Page({ params }) {
  // Находим бренд по slug из параметров URL
  const brand = brands.find(brand => brand.slug === params.slug);

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return (
    <main>
      <section className={styles.category__hero}>
        <h1 className={styles.category__title}>Запчасти для грузовиков {brand.name}</h1>
      </section>
      {/* <h1>{brand.title}</h1>
      <p>{brand.description}</p> */}
      {/* <p>Slug: {brand.slug}</p> */}
    </main>
  );
}