'use client'
import { useState, useEffect } from 'react';
import styles from "./feedback.module.css";
import Link from 'next/link';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agreeToPrivacy: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', agreeToPrivacy: false });
    setSubmitting(false);
  };

  const showMessage = (type) => {
    if (timer) {
      clearTimeout(timer);
    }
    
    if (type === 'success') {
      setShowSuccess(true);
      setShowError(false);
    } else {
      setShowError(true);
      setShowSuccess(false);
    }
    
    // Устанавливаем таймер на 5 секунд
    const newTimer = setTimeout(() => {
      setShowSuccess(false);
      setShowError(false);
      resetForm();
    }, 5000);
    
    setTimer(newTimer);
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

    // Простая валидация
    if (!formData.name.trim() || !formData.phone.trim()) {
      showMessage('error');
      return;
    }

    try {
      // Получаем текущий URL страницы
      const pageUrl = window.location.href;

      // Отправляем данные на API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          agreeToPrivacy: formData.agreeToPrivacy,
          pageUrl: pageUrl
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Показываем сообщение об успехе
        showMessage('success');
      } else {
        // Показываем сообщение об ошибке
        showMessage('error');
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      showMessage('error');
    }
  };

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <div className={`${styles.feedback} feedback`}>
      
      {/* Сообщение об успехе */}
      {showSuccess && (
        <div className={styles.successContainer}>
          <p className={styles.successText}>Спасибо! <br/>Данные успешно отправлены.</p>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {showError && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Ошибка! <br/>Данные не отправлены.</p>
        </div>
      )}

      {/* Основная форма (показывается когда нет сообщений) */}
      {!showSuccess && !showError && (
        <>
          <p className={styles.feedback__title}>Остались вопросы?</p>
          <p className={styles.feedback__subtitle}>Оставьте заявку, и мы свяжемся с Вами в ближайшее время</p>
          
          <form onSubmit={handleSubmit} className={styles.feedback__form}>
            <input 
              type="text" 
              name="name" 
              placeholder="Ваше имя" 
              autoComplete="given-name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={submitting}
            />
            <input 
              type="tel" 
              name="phone" 
              placeholder="+7 (999) 999-99-99" 
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled={submitting}
            />
            
            {/* Чекбокс согласия с политикой */}
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
              <span className={styles.checkbox__label}>
                Я даю согласие на обработку своих персональных данных, согласно <Link href="/privacy">политике конфиденциальности</Link>
              </span>
            </label>

            <button 
              type="submit" 
              disabled={submitting || !formData.name.trim() || !formData.phone.trim() || !formData.agreeToPrivacy}
            >
              {submitting ? 'Отправляем...' : 'Оставить заявку'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}