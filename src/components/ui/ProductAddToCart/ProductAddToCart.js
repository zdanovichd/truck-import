'use client';
import ProductAddToCartServer from "./ProductAddToCart.server.js";
import dynamic from 'next/dynamic';

const ProductAddToCartClient = dynamic(
  () => import('./ProductAddToCart.client.js'),
  { ssr: false }
);

export default function ProductAddToCart({ props_count = 0 }) {
  return (
    <>
      <ProductAddToCartServer props_count={props_count} />
      <ProductAddToCartClient props_count={props_count} />
    </>
  );
}

// "use client";
// import Image from "next/image";
// import styles from "./productaddtocart.module.css";
// import { useState } from "react";

// export default function ProductAddToCart({ props_count = 0 }) {
//     const [count, setCount] = useState(0);
//     const [inputValue, setInputValue] = useState(count.toString());

//     const handleCountChange = (newCount) => {
//         const validatedCount = Math.max(0, Math.min(newCount, props_count));
//         setCount(validatedCount);
//         setInputValue(validatedCount.toString());
//     };

//     const handleInputBlur = () => {
//         const numValue = parseInt(inputValue) || 1;
//         handleCountChange(numValue);
//     };

//     return (
//         <>
//             <div className={styles.cart__button}>
//                 {props_count > 0 ? (
//                     count > 0 ? (
//                         <>
//                             <button
//                                 className={styles.cart__button_enabled}
//                                 onClick={() => handleCountChange(count - 1)}
//                             >
//                                 -
//                             </button>

//                             <input
//                                 type="number"
//                                 value={inputValue}
//                                 onChange={(e) => setInputValue(e.target.value)}
//                                 onBlur={handleInputBlur}
//                                 onKeyDown={(e) =>
//                                     e.key === "Enter" && handleInputBlur()
//                                 }
//                                 max={props_count}
//                                 className={styles.counter__input}
//                             />

//                             <button
//                                 className={styles.cart__button_enabled}
//                                 onClick={() => handleCountChange(count + 1)}
//                                 disabled={count >= props_count}
//                             >
//                                 +
//                             </button>
//                         </>
//                     ) : (
//                         <button
//                             className={styles.cart__button_enabled}
//                             onClick={() => handleCountChange(count + 1)}
//                         >
//                             <Image
//                                 src="/cart.svg"
//                                 alt="cart"
//                                 className={styles.cart__icon}
//                                 width={500}
//                                 height={300}
//                             />
//                             Добавить в корзину
//                         </button>
//                     )
//                 ) : (
//                     <button className={styles.cart__button_disabled} disabled>
//                         Нет в наличии
//                     </button>
//                 )}
//             </div>
//         </>
//     );
// }
