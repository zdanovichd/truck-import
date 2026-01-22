import styles from "./product.module.css";
import Image from "next/image";
import Link from "next/link";
import Search from "@/components/ui/Search/Search";
import ProductAddToCart from "@/components/ui/ProductAddToCart/ProductAddToCart";

export default function Product({ product = [] }) {

    const specifications = product.specifications;
    return (
        <main>
            <section className={styles.product__search}>
                <p className={styles.product__search_title}>
                    Быстрый поиск детали по артикулу:
                </p>
                <Search />
            </section>
            <section className={styles.product}>
                <h1 className={styles.product__title}>
                    <span className={styles.product__name}>{product.name}</span>{" "}
                    <span className={styles.sku}>{product.sku}</span>
                </h1>
                <div className={styles.product__wrapper}>
                    <div className={styles.product__data}>
                        <div className={styles.product__image}>
                            {/* <p>{product.name}</p> */}
                            <p>{product.sku}</p>
                        </div>
                        {/* <Image
                            src={`https://placehold.co/${parseInt( (357 / 1440) * 2000 )}x${parseInt( (371 / 1440) * 2000 )}.png?text=${product.sku}`}
                            // src={`/products/${product.sku}/0.png`}
                            alt={`${product.name} ${product.sku}`}
                            className={styles.product__image}
                            width={500}
                            height={300}
                        /> */}
                        <div className={styles.specifications}>
                            <p className={styles.specifications__title}>
                                Технические характеристики
                            </p>
                            <div className={styles.specifications__inner}>
                                    <span
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            Бренд
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            <Link href={`/brands/${product.brand}`}>
                                                {product.brand}
                                            </Link>
                                        </span>
                                    </span>

                                    <span
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            Модель
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            <Link href={`/brands/${product.model}`}>
                                                {product.model}
                                            </Link>
                                        </span>
                                    </span>

                                    <span
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            Категория
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            {product.category_id}
                                        </span>
                                    </span>
                                {specifications.map((item, index) => (
                                    <span
                                        key={index}
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            {item[0]}
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            {item[1]}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.product__inner}>
                        <div className={styles.count}>
                            {product.count > 0 ? (
                                <p className={styles.in_stock}>
                                    Доступно для заказа
                                </p>
                            ) : (
                                <p className={styles.out_of_stock}>
                                    Нет в наличии
                                </p>
                            )}
                        </div>
                        <div className={styles.selling__data}>
                            <span className={styles.selling__brand}>
                                <span className={styles.selling__brand_name}>
                                    Бренд:{" "}
                                </span>
                                <span className={styles.selling__brand_value}>
                                    <Link href={`/brands/${product.brand}`}>
                                        {product.brand}
                                    </Link>
                                </span>
                            </span>
                            <span className={styles.selling__delivery}>
                                <span className={styles.selling__delivery_name}>
                                    Сроки отправки:{" "}
                                </span>
                                <span
                                    className={styles.selling__delivery_value}
                                >
                                    {product.delivery}
                                </span>
                            </span>
                            <span className={styles.selling__price}>
                                <span className={styles.selling__price_name}>
                                    Цена:{" "}
                                </span>
                                <span className={styles.selling__price_value}>
                                    {product.price} ₽
                                </span>
                            </span>
                        </div>
                        {/* <ProductAddToCart props_count={product.count}/> */}
                        <ProductAddToCart 
        props_count={product.count}
        productId={product.id}
        productSku={product.sku}
      />
                        <div className={`${styles.specifications} ${styles._mobile}`}>
                            <p className={styles.specifications__title}>
                                Технические характеристики
                            </p>
                            <div className={styles.specifications__inner}>
                                    <span
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            Бренд
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            {product.brand}
                                        </span>
                                    </span>

                                    <span
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            Модель
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            {product.model}
                                        </span>
                                    </span>

                                    <span
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            Категория
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            {product.category_id}
                                        </span>
                                    </span>
                                {specifications.map((item, index) => (
                                    <span
                                        key={index}
                                        className={styles.specification}
                                    >
                                        <span
                                            className={
                                                styles.specification__name
                                            }
                                        >
                                            {item[0]}
                                        </span>
                                        <span
                                            className={
                                                styles.specification__value
                                            }
                                        >
                                            {item[1]}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.about}>
                    <h2 className={styles.about__title}>О товаре:</h2>
                    <p className={styles.about__description}>
                        Оригинальная запчасть или качественный аналог — {product.name}, арт. {product.sku}. Подходит для {product.model}. Производитель: {product.brand}. Высокая износостойкость и точное соответствие заводским стандартам. Закажите надёжную запчасть в интернет-магазине Truck-Import — оперативная доставка по всей России.
                    </p>
                </div>
            </section>
        </main>
    );
}