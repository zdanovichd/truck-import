'use client';

import { useEffect, useState } from 'react';
import * as CartActions from '@/actions/cart';
import styles from './page.module.css'
import Link from 'next/link';

export default function CartClient() {
  const [cart, setCart] = useState({ i: [] });
  const [products, setProducts] = useState({});
  const [selectedProducts, setSelectedProducts] = useState(new Set()); // Для удаления
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  // Загружаем корзину и информацию о товарах
  useEffect(() => {
    loadCartAndProducts();
  }, []);

  // Обновляем selectAll при изменении выбранных товаров
  useEffect(() => {
    const allSelected = Object.keys(products).length > 0 &&
      selectedProducts.size === Object.keys(products).length;
    setSelectAll(allSelected);
  }, [selectedProducts, products]);

  const loadCartAndProducts = async () => {
    try {
      // 1. Загружаем корзину
      const cartRes = await fetch('/api/cart');
      const cartData = await cartRes.json();
      setCart(cartData);

      // 2. Загружаем информацию о товарах из корзины
      if (cartData.i && cartData.i.length > 0) {
        const productsInfo = {};

        for (const [productId, qty] of cartData.i) {
          try {
            const productRes = await fetch(`/api/products/${productId}`);
            if (productRes.ok) {
              const productData = await productRes.json();
              productsInfo[productId] = {
                ...productData,
                quantity: Number(qty) || 1
              };
            }
          } catch (error) {
            console.error(`Ошибка загрузки товара ${productId}:`, error);
            // Создаем fallback
            productsInfo[productId] = {
              id: productId,
              name: `Товар ${productId}`,
              price: "0",
              quantity: Number(qty) || 1,
              count: 0,
              sku: productId.toString(),
              brand: "Неизвестно",
              delivery: "Не указано"
            };
          }
        }

        setProducts(productsInfo);
        // Пустой выбор по умолчанию
        setSelectedProducts(new Set());
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Выбор/снятие одного товара для удаления
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  // Выбрать все / снять все для удаления
  const toggleSelectAll = () => {
    if (selectAll) {
      // Снимаем выделение со всех
      setSelectedProducts(new Set());
    } else {
      // Выделяем все товары для удаления
      setSelectedProducts(new Set(Object.keys(products)));
    }
    setSelectAll(!selectAll);
  };

  // Удалить выбранные товары
  const handleRemoveSelected = async () => {
    if (selectedProducts.size === 0) {
      alert('Выберите товары для удаления');
      return;
    }

    // Подтверждение удаления
    if (!confirm(`Удалить ${selectedProducts.size} выбранных товаров?`)) {
      return;
    }

    // Создаем копии для оптимистичного обновления
    const newProducts = { ...products };
    const newSelected = new Set(selectedProducts);

    // Удаляем выбранные товары из продуктов
    for (const productId of selectedProducts) {
      delete newProducts[productId];
      newSelected.delete(productId);
    }

    // 1. Оптимистичное обновление UI
    setProducts(newProducts);
    setSelectedProducts(newSelected);

    // 2. Обновляем локальную корзину
    setCart(prev => ({
      ...prev,
      i: prev.i.filter(([id]) => !selectedProducts.has(id))
    }));

    // 3. Удаляем выбранные товары из куки
    for (const productId of selectedProducts) {
      await CartActions.removeFromCart(productId);
    }
  };

  // Очистить всю корзину
  const handleClearCart = async () => {
    if (!confirm('Очистить всю корзину?')) {
      return;
    }

    // 1. Очищаем UI
    setProducts({});
    setSelectedProducts(new Set());
    setCart({ i: [] });

    // 2. Очищаем куки
    await CartActions.clearCart();
  };

  // Изменение количества с сохранением в куки
  const handleQtyChange = async (productId, newQty) => {
    const quantity = Math.max(1, Math.min(
      products[productId]?.count || 999,
      Number(newQty) || 1
    ));

    // 1. Оптимистичное обновление UI
    setProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity
      }
    }));

    // 2. Обновляем локальное состояние корзины
    setCart(prev => {
      const newItems = [...prev.i];
      const itemIndex = newItems.findIndex(([id]) => id === productId);

      if (itemIndex !== -1) {
        newItems[itemIndex] = [productId, quantity];
      }

      return { ...prev, i: newItems };
    });

    // 3. Сохраняем в куки (но не перезагружаем товары!)
    await CartActions.setCartQuantity(productId, quantity);
  };

  // Удаление одного товара
  const handleRemoveProduct = async (productId) => {
    if (!confirm('Удалить этот товар из корзины?')) {
      return;
    }

    // 1. Оптимистичное удаление из UI
    const newProducts = { ...products };
    delete newProducts[productId];
    setProducts(newProducts);

    // 2. Убираем из выбранных (если был выбран)
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(productId);
      return newSelected;
    });

    // 3. Обновляем локальную корзину
    setCart(prev => ({
      ...prev,
      i: prev.i.filter(([id]) => id !== productId)
    }));

    // 4. Удаляем из куки
    await CartActions.removeFromCart(productId);
  };

  // Подсчет общего количества всех товаров (штук)
  const calculateTotalItems = () => {
    let totalItems = 0;
    for (const productId in products) {
      const product = products[productId];
      if (product) {
        totalItems += Number(product.quantity) || 0;
      }
    }
    return totalItems;
  };

  // Считаем сумму ВСЕХ товаров в корзине
  const calculateTotal = () => {
    let total = 0;
    for (const productId in products) {
      const product = products[productId];
      if (product) {
        const price = parseFloat(product.price) || 0;
        const quantity = Number(product.quantity) || 1;
        total += price * quantity;
      }
    }
    return total.toFixed(2);
  };

  // Количество товаров для удаления
  const selectedForDeletion = selectedProducts.size;
  const totalItems = Object.keys(products).length;

  if (loading) return <p>Загрузка корзины...</p>;


  return (
    <>
      {cart.i.length === 0 ? (
          <p className={styles.cart__empty}>Корзина пуста</p>
        ) : (
          <>

            <div className={styles.cart__top}>
              <div className={styles.cart__topItem}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className={styles.checkbox__input}
                  />
                  <span className={styles.checkbox__control}></span>
                  <span className={styles.checkbox__label}>Выбрать все</span>
                </label>
              </div>
              <div className={styles.cart__topItem}>
                <p>Артикул</p>
              </div>
              <div className={styles.cart__topItem}>
                <p>Наименование</p>
              </div>
              <div className={styles.cart__topItem}>
                <p>Цена, руб.</p>
              </div>
              <div className={styles.cart__topItem}>
                <p>Количество</p>
              </div>
              <div className={styles.cart__topItem}>
                <p>Сумма, руб.</p>
              </div>
            </div>

            <div className={styles.cart__middle}>

              {Object.entries(products).map(([productId, product]) => {
                const quantity = Number(product.quantity) || 1;
                const isSelected = selectedProducts.has(productId);

                return (
                  <div
                    key={productId}
                    className={`${styles.productItem} ${isSelected ? styles.selectedForDeletion : ''}`}
                  >

                    <div className={styles.productSelection}>
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProductSelection(productId)}
                          className={styles.checkbox__input}
                          aria-label={`Выбрать ${product.name} для удаления`}
                        />
                        <span className={styles.checkbox__control}></span>
                      </label>
                    </div>

                    <div className={styles.productInfo}>
                      <div className={styles.product__image}>
                        <p>{product.sku}</p>
                      </div>

                      <div className={styles.productInfo__article}>
                        <p className={styles.productSku}>{product.sku}</p>
                        <p className={styles.productBrand}>{product.brand}</p>
                      </div>

                      <p className={styles.productName}>{product.name}</p>

                      

                    </div>

                    <div className={styles.productControls}>

                      <p className={styles.productPrice}>
                        {product.price} ₽
                      </p>

                      <div className={styles.quantityControl}>
                        <div className={styles.quantityWrapper}>
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = Math.max(1, quantity - 1);
                              handleQtyChange(productId, newQty);
                            }}
                            className={styles.quantityButton}
                            aria-label="Уменьшить количество"
                            disabled={quantity == 1}
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min={1}
                            max={product.count || 999}
                            value={quantity}
                            onChange={e => {
                              const value = e.target.value;
                              handleQtyChange(productId, value);
                            }}
                            onBlur={e => {
                              // Если поле пустое или 0, устанавливаем 1
                              if (!e.target.value || Number(e.target.value) < 1) {
                                handleQtyChange(productId, 1);
                              }
                            }}
                            className={styles.quantityInput}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const maxQty = product.count || 999;
                              const newQty = Math.min(maxQty, quantity + 1);
                              handleQtyChange(productId, newQty);
                            }}
                            className={styles.quantityButton}
                            aria-label="Увеличить количество"
                            disabled={quantity == product.count}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className={styles.productSubtotal}>
                        {((parseFloat(product.price) || 0) * quantity).toFixed(2)} ₽
                      </div>

                      <button
                        onClick={() => handleRemoveProduct(productId)}
                        className={styles.removeButton}
                      >
                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L10 10M10 10L19 19M10 10L1 19M10 10L19 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className={styles.cart__bottom}>


              <button
                onClick={handleRemoveSelected}
                className={styles.removeSelectedButton}
                disabled={selectedForDeletion === 0}
              >
                Удалить выбранное
              </button>

              <div className={styles.cartSummary}>

                <div className={styles.cartSummary__top}>
                  <p className={styles.cartSummary__title}>Итого:</p>

                  <p className={styles.totalTitle}>
                    {calculateTotalItems()} шт.
                  </p>

                  <p className={styles.totalAmount}>{calculateTotal()} ₽</p>
                </div>

                <div className={styles.cartSummary__bottom}>
                  <Link
                  href={"/cart/checkout"}
                  className={styles.cart__checkout}
                  >
                    Оформить заказ
                  </Link>
                </div>

              </div>


            </div>




            {/* <button 
                onClick={handleClearCart} 
                className={styles.clearButton}
              >
                Очистить всю корзину
              </button> */}

          </>
        )}
    </>
  );
}