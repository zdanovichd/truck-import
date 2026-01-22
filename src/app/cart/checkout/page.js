'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as CartActions from '@/actions/cart';
import Link from 'next/link';
import styles from './page.module.css';

export default function CheckoutPage() {
  const [cart, setCart] = useState({ i: [] });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    agreeToPrivacy: false
  });
  const router = useRouter();

  // Загружаем корзину и товары
  useEffect(() => {
    loadCartAndProducts();
  }, []);

  const loadCartAndProducts = async () => {
    try {
      // Загружаем корзину через API
      const cartRes = await fetch('/api/cart');
      const cartData = await cartRes.json();
      
      // Если корзина пуста - редирект на главную
      if (!cartData.i || cartData.i.length === 0) {
        router.push('/');
        return;
      }
      
      setCart(cartData);
      
      // Загружаем информацию о товарах
      const productsInfo = [];
      for (const [productId, qty] of cartData.i) {
        try {
          const productRes = await fetch(`/api/products/${productId}`);
          if (productRes.ok) {
            const productData = await productRes.json();
            productsInfo.push({
              ...productData,
              quantity: Number(qty) || 1
            });
          }
        } catch (error) {
          console.error(`Ошибка загрузки товара ${productId}:`, error);
        }
      }
      
      setProducts(productsInfo);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Проверяем согласие с политикой
    if (!formData.agreeToPrivacy) {
      alert('Пожалуйста, согласитесь с политикой конфиденциальности');
      setSubmitting(false);
      return;
    }

    try {
      // Рассчитываем общую сумму
      const totalAmount = products.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0).toFixed(2);

      // Подготавливаем данные для отправки
      const orderData = {
        ...formData,
        cart: products,
        totalAmount: totalAmount,
        orderDate: new Date().toISOString()
      };

      // Отправляем заказ на почту
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrderNumber(result.orderNumber);
        setOrderSubmitted(true);
        
        // Очищаем корзину после успешного оформления
        await CartActions.clearCart();
      } else {
        throw new Error(result.message || 'Ошибка при отправке заказа');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Произошла ошибка: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main>
        <section className={styles.checkout}>
          <p className={styles.loading}>Загрузка заказа...</p>
          <p className={styles.loading}>Пожалуйста, подождите...</p>
        </section>
      </main>
    );
  }

  if (orderSubmitted) {
    return (
      <main>
        <section className={`${styles.checkout} ${styles.checkout_submit}`}>
          <div className={styles.checkoutFormWrapper}>
            <p className={styles.submitTitle}>Спасибо! <br className={styles.submitTitleBr_mob}/>Ваш заказ оформлен! <br/>Ждите подтверждения от&nbsp;менеджера. Информация о&nbsp;заказе направлена на&nbsp;ваш e-mail.</p>
            <Link href="/catalog" className={styles.continueShopping}>
              Вернуться в катаог
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Рассчитываем общую сумму
  const totalAmount = products.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0).toFixed(2);

  return (
    <main>
        <section className={styles.checkout}>
          <div className={styles.checkoutFormWrapper}>
            <p className={styles.formTitle}>Заполните, пожалуйста, ваши контактные данные:</p>
            
            {/* Информация о заказе */}
            {/* <div className={styles.order-summary}>
              <h3>Ваш заказ ({products.length} товаров):</h3>
              <ul className={styles.order-items">
                {products.map((item, index) => (
                  <li key={index} className={styles.order-item">
                    <span className={styles.item-name">{item.name}</span>
                    <span className={styles.item-quantity">{item.quantity} шт.</span>
                    <span className={styles.item-price">{item.price} ₽</span>
                  </li>
                ))}
              </ul>
              <div className={styles.order-total">
                <span>Итого:</span>
                <span className={styles.total-amount">{totalAmount} ₽</span>
              </div>
            </div> */}

            <form onSubmit={handleSubmit} className={styles.checkoutForm}>
              {/* ФИО */}
              <div className={styles.formGroup}>
                {/* <label htmlFor="name">ФИО *</label> */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ФИО*"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Телефон */}
              <div className={styles.formGroup}>
                {/* <label htmlFor="phone">Телефон*</label> */}
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Телефон*"
                  required
                  autoComplete="tel"
                />
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                {/* <label htmlFor="email">Email *</label> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email*"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Название организации */}
              <div className={styles.formGroup}>
                {/* <label htmlFor="company">Название организации</label> */}
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Наименование организации"
                  autoComplete="organization"
                />
              </div>

              {/* Кнопка оформления заказа */}
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={submitting || !formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.agreeToPrivacy || products.length === 0}
              >
                {submitting ? 'Оформляем заказ...' : `Оформить заказ`}
              </button>

              {/* Чекбокс согласия с политикой */}
              <div className={styles.privacyCheckbox}>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onChange={handleInputChange}
                    required
                    className={styles.checkbox__input}
                  />
                  <span className={styles.checkbox__control}></span>
                  <span className={styles.checkbox__label}>Я даю согласие на обработку своих персональных данных, согласно <Link href="/privacy">политике конфиденциальности</Link></span>
                </label>

              </div>

            </form>
          </div>
        </section>
    </main>
  );
}