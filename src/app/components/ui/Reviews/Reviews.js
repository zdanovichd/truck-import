'use client'
import Rating from "../Rating/Rating";
import styles from "./reviews.module.css";
import Image from "next/image";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import { useState, useEffect, useRef, useCallback } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Reviews() {
    const [spaceBetween, setSpaceBetween] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
      // Функция для обновления размеров
      const handleResize = () => {
        const newWidth = window.innerWidth;
        setWindowWidth(newWidth);
        setSpaceBetween((10 * newWidth) / 100 / 14.4);
      };

      // Вызываем сразу для установки начальных значений
      handleResize();

      // Добавляем слушатель
      window.addEventListener('resize', handleResize);

      // Убираем слушатель при размонтировании
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigationNextRef = useRef(null);
  const navigationPrevRef = useRef(null);

    return (
        <section className={styles.reviews}>
            <SectionTitle
                title="Отзывы"
            />
            <div className={styles.swiper__container}>
                <Swiper
                    slidesPerView={2}
                    loop={true}
                    slidesPerGroup={2}
                    spaceBetween={spaceBetween}
                    setWrapperSize={true}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}
                    pagination={true}
                    modules={[Navigation, Pagination]}
                    >

                    <SwiperSlide className={styles.review}>
                        <div className={styles.review__content}>
                            <Rating mark={[5]}/>
                            <p className={styles.review__text}>
                                "Обратился в эту компанию по рекомендации коллег. Остался доволен широким ассортиментом и оперативностью работы. Особенно порадовала возможность заказать товар оптом с доставкой в регион. Цены ниже, чем у других оптовых компаний, а качество продукции на высоком уровне."
                            </p>
                        </div>
                        <div className={styles.review__user}>
                            <Image
                                className={styles.review__avatar}
                                src={`/avatar.png`}
                                alt={`Алексей М.`}
                                width={500}
                                height={300}
                                style={{
                                    width: 'calc(48vw/14.4)',
                                    height: 'calc(48vw/14.4)',
                                }}
                            />
                            <p className={styles.review__name}>Алексей М.</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className={styles.review}>
                        <div className={styles.review__content}>
                            <Rating mark={[5]}/>
                            <p className={styles.review__text}>
                            "Работаю с магазином уже два года. За это время ни разу не возникло проблем с наличием запчастей или их качеством. Отдельное спасибо менеджерам, которые всегда помогают быстро найти нужное наименование. Рекомендую как надежного партнера!"
                            </p>
                        </div>
                        <div className={styles.review__user}>
                            <Image
                                className={styles.review__avatar}
                                src={`/avatar.png`}
                                alt={`Роман С.`}
                                width={500}
                                height={300}
                                style={{
                                    width: 'calc(48vw/14.4)',
                                    height: 'calc(48vw/14.4)',
                                }}
                            />
                            <p className={styles.review__name}>Роман С.</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className={styles.review}>
                        <div className={styles.review__content}>
                            <Rating mark={[5]}/>
                            <p className={styles.review__text}>
                            "Как владелец магазина грузовых запчастей, я ценю профессионализм и ответственность в бизнесе. Эта компания полностью соответствует этим критериям. Удобно, что можно получить подробную информацию о товаре и условиях сотрудничества сразу после звонка."
                            </p>
                        </div>
                        <div className={styles.review__user}>
                            <Image
                                className={styles.review__avatar}
                                src={`/avatar.png`}
                                alt={`Егор Р.`}
                                width={500}
                                height={300}
                                style={{
                                    width: 'calc(48vw/14.4)',
                                    height: 'calc(48vw/14.4)',
                                }}
                            />
                            <p className={styles.review__name}>Егор Р.</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className={styles.review}>
                        <div className={styles.review__content}>
                            <Rating mark={[5]}/>
                            <p className={styles.review__text}>
                            "Заказывал амортизаторы и элементы тормозной системы для своего парка грузовиков. Все детали были в наличии, а цена приятно удивила. Сотрудники компании всегда готовы предложить оптимальное решение под запрос клиента."
                            </p>
                        </div>
                        <div className={styles.review__user}>
                            <Image
                                className={styles.review__avatar}
                                src={`/avatar.png`}
                                alt={`Илья Л.`}
                                width={500}
                                height={300}
                                style={{
                                    width: 'calc(48vw/14.4)',
                                    height: 'calc(48vw/14.4)',
                                }}
                            />
                            <p className={styles.review__name}>Илья Л.</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className={styles.review}>
                        <div className={styles.review__content}>
                            <Rating mark={[5]}/>
                            <p className={styles.review__text}>
                            "Хочу отметить высокий уровень сервиса и внимательное отношение к клиентам. Заказывал запчасти оптом для ремонта полуприцепов. Доставка была выполнена точно в срок, а качество продукции превзошло ожидания. Буду обращаться снова!"
                            </p>
                        </div>
                        <div className={styles.review__user}>
                            <Image
                                className={styles.review__avatar}
                                src={`/avatar.png`}
                                alt={`Илья А.`}
                                width={500}
                                height={300}
                                style={{
                                    width: 'calc(48vw/14.4)',
                                    height: 'calc(48vw/14.4)',
                                }}
                            />
                            <p className={styles.review__name}>Илья А.</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className={styles.review}>
                        <div className={styles.review__content}>
                            <Rating mark={[5]}/>
                            <p className={styles.review__text}>
                            "Спасибо за отличное обслуживание и широкий выбор запчастей HOWO. Нашел здесь все необходимые детали для ремонта грузовика. Особая благодарность за оперативный поиск и помощь в оформлении заказа. Рекомендую всем, кто ищет надежного поставщика!"
                            </p>
                        </div>
                        <div className={styles.review__user}>
                            <Image
                                className={styles.review__avatar}
                                src={`/avatar.png`}
                                alt={`Максим А.`}
                                width={500}
                                height={300}
                                style={{
                                    width: 'calc(48vw/14.4)',
                                    height: 'calc(48vw/14.4)',
                                }}
                            />
                            <p className={styles.review__name}>Максим А.</p>
                        </div>
                    </SwiperSlide>

                </Swiper>
                <div className="swiper-button-prev" ref={navigationPrevRef}>
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1L2 7.5L8 14" stroke="#141313" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <div className="swiper-button-next" ref={navigationNextRef}>
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7.5L1 14" stroke="#141313" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>
        </section>
    )
}