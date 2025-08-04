import SectionTitle from '@/components/ui/SectionTitle/SectionTitle';
import styles from './page.module.css'
import Image from 'next/image';

export async function generateMetadata() {
    return {
      title: 'Вакансии - truck-import',
      description: 'Ищете работу в стабильной и динамично развивающейся компании? Посмотрите доступные вакансии в «truck-import» — присоединяйтесь к команде профессионалов в сфере продаж запчастей для импортных грузовиков!',
    };
}

export default async function Page() {

  return (
    <main>
      <section className={styles.vakansii__hero}>
        <h1 className={styles.vakansii__title}>
          Вакансии
        </h1>
      </section>

      <section className={styles.vakansii__content}>
        <div className={styles.main__text}>
          <p>Мы &mdash; команда профессионалов, которая с уверенностью движется вперед, развиваясь и совершенствуя каждый аспект своей работы. Наша компания специализируется на продаже качественных запчастей для импортных грузовых автомобилей, объединяя опыт, надежность и стремление к высоким стандартам.</p>
          <br/>
          <p>Для нас важны люди, которые становятся частью общего дела. Мы верим, что успех компании строится на сплоченной работе коллектива, взаимном уважении и стремлении к развитию.</p>
          <br/>
          <p>Наши ключевые ценности:</p>
          <br/>
          <ul>
            <li>Ответственность</li>
            <li>Командный дух</li>
            <li>Клиентоориентированность</li>
            <li>Профессиональный рост</li>
            <li>Открытость новому</li>
          </ul>
          <br/>
          <p>Если ты готов развиваться в динамичной и дружной команде, тебе интересно дело, которое имеет результат, &mdash; мы будем рады видеть тебя среди наших сотрудников!</p>
        </div>
        <p className={styles.text__left_border}>Если ты готов развиваться в динамичной и дружной команде, тебе интересно дело, которое имеет результат, — мы будем рады видеть тебя среди наших сотрудников!</p>
      </section>

      <section className={styles.advantages}>
        <SectionTitle
          title="Актуальные вакансии"
          align='center'
        />
        <p className={styles.advantages__subtitle}>В данный момент актуальных вакансий нет</p>
        </section>
    </main>
  );
}
