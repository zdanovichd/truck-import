// import Image from "next/image";
// import styles from "./page.module.css";
// import Search from "./components/ui/Search/Search";
// import Brands from "./components/ui/Brands/Brands";

export default function Page() {
  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>Грузовые запчасти оптом</h1>
        <Search
          style={{ marginBottom: 'calc(117vw / 14.4)' }}
        />
        <Brands
          brands={["scania", "daf", "volvo", "mercedes", "man"]}
          theme="gray"
        />
      </section>
      
    </main>
  )
}
