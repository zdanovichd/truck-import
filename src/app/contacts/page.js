import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export async function generateMetadata() {
    return {
        title: "Контактная информация магазина truck-import",
        description:
            "Свяжитесь с нами любым удобным способом. Контактная информация магазина truck-import: телефон, email, адрес и время работы. Мы всегда на связи!",
    };
}

const phoneNumbers = [
    { number: "+7 (900) 604-46-14", href: "tel:+79006044614" },
    { number: "+7 (909) 913-11-86", href: "tel:+79099131186" },
];

export default async function Page() {
    return (
        <main>
            <section className={styles.contacts__hero}>
                <div className={styles.contacts__item}>
                    <h1 className={styles.contacts__title}>Контакты</h1>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Телефон:</p>
                        <div className={styles.contact__method_phones}>
                            <Link
                                href={phoneNumbers[0].href}
                                className={styles.contact__method_phone}
                            >
                                {phoneNumbers[0].number}
                            </Link>
                            <Link
                                href={phoneNumbers[1].href}
                                className={styles.contact__method_phone}
                            >
                                {phoneNumbers[1].number}
                            </Link>
                        </div>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Email:</p>
                        <Link
                            href={`mailto:import-aa@mail.ru`}
                            className={styles.contact__method_value}
                        >
                            import-aa@mail.ru
                        </Link>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Режим работы:
                        </p>
                        <p className={styles.contact__method_value}>
                            Пн-пт: 9:00 - 18:00
                        </p>
                    </div>
                </div>

                <div className={styles.contacts__item}>
                    <h2>Мы на карте</h2>
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A68332f3d177a559fb7b8de668a2c1649f9c0bbbf09ac42a567aa41fec18d98f7&amp;source=constructor"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                    ></iframe>
                </div>
                <div className={styles.contacts__item}>
                    <p>
                        <span>Почтовый адрес:</span>
                    </p>
                    <p>
                        Тел/факс:{" "}
                        <Link href={`tel:89269261359`}>8 (926) 926 13-59</Link>;
                        Московская область, Раменский район, д. Толмачево, ул.
                        Сергея Воробьева
                    </p>
                </div>
            </section>

            <section className={styles.requisites}>
                <h2 className={styles.requisites__title}>Наши реквизиты</h2>
                <div className={styles.requisites__inner}>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Генеральный директор
                        </p>
                        <p className={styles.contact__method_value}>
                            А.В. Рачков
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>ИНН/КПП</p>
                        <p className={styles.contact__method_value}>
                            5027260005/502701001
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Ресчетный счет
                        </p>
                        <p className={styles.contact__method_value}>
                            40702810502710002846
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Юридический адрес
                        </p>
                        <p className={styles.contact__method_value}>
                            140060, Московская Область, Г.О. Люберцы, ПГТ.
                            Октябрьский, ул. Ленина, д. 41
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Банк</p>
                        <p className={styles.contact__method_value}>
                            АО «Альфа Банк» г. Москва
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>БИК</p>
                        <p className={styles.contact__method_value}>
                            044525593
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Корреспондентский счет
                        </p>
                        <p className={styles.contact__method_value}>
                            30101810200000000815
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Наименование организации
                        </p>
                        <p className={styles.contact__method_value}>
                            ООО &quot;Импорт&quot;
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.socials}>
                <h2 className={styles.socials__title}>
                    Мы в социальных сетях:
                </h2>
                <div className={styles.socials__inner}>
                    <Link className={styles.social} href="#">
                        <Image
                            src="/whatsapp.svg"
                            alt="whatsapp"
                            width={500}
                            height={300}
                        />
                    </Link>
                    <Link className={styles.social} href="#">
                        <Image
                            src="/telegram.svg"
                            alt="telegram"
                            width={500}
                            height={300}
                        />
                    </Link>
                </div>
            </section>
        </main>
    );
}
