import styles from './page.module.css'

export async function generateMetadata() {
    return {
      title: 'Контактная информация магазина truck-import',
      description: 'Свяжитесь с нами любым удобным способом. Контактная информация магазина truck-import: телефон, email, адрес и время работы. Мы всегда на связи!',
    };
}

export default async function Page() {

  return (
    <main>

      <section className={styles.contacts__hero}>
        <h1 className={styles.contacts__title}>
          Контакты
        </h1>
      </section>

      <section className={styles.contacts__content}>

      </section>
    </main>
  );
}
