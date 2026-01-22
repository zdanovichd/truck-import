import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  let responseData;
  let statusCode = 200;
  
  try {
    // Пробуем прочитать тело запроса
    let orderData;
    try {
      orderData = await request.json();
      console.log('Получен заказ:', {
        name: orderData.name,
        phone: orderData.phone,
        items: orderData.cart?.length || 0
      });
    } catch (jsonError) {
      console.error('Ошибка парсинга JSON запроса:', jsonError);
      responseData = {
        success: false,
        message: 'Неверный формат данных',
        error: jsonError.message
      };
      statusCode = 400;
      throw new Error('Invalid JSON');
    }

    // Валидация
    if (!orderData.name || !orderData.phone || !orderData.email) {
      responseData = {
        success: false,
        message: 'Не все обязательные поля заполнены'
      };
      statusCode = 400;
      throw new Error('Missing required fields');
    }

    // Создаем транспортер
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Простой текст письма
    const mailText = `
Новый заказ с сайта truck-import.ru

Клиент: ${orderData.name}
Телефон: ${orderData.phone}
Email: ${orderData.email}
${orderData.company ? `Организация: ${orderData.company}` : ''}

Товары:
${orderData.cart?.map(item => 
  `- ${item.name} (${item.sku}): ${item.quantity} шт. × ${item.price} ₽`
).join('\n')}

Общая сумма: ${orderData.totalAmount} ₽
Дата: ${new Date().toLocaleString('ru-RU')}
    `;

    console.log('Отправляем письмо...');
    const info = await transporter.sendMail({
      from: `"Truck Import" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_EMAIL,
      subject: `Новый заказ от ${orderData.name}`,
      text: mailText,
    });

    console.log('Письмо отправлено:', info.messageId);

    responseData = {
      success: true,
      message: 'Заказ успешно отправлен',
      orderNumber: Date.now().toString().slice(-6)
    };

  } catch (error) {
    console.error('Ошибка в /api/orders:', error);
    
    // Если responseData еще не установлен, устанавливаем ошибку
    if (!responseData) {
      responseData = {
        success: false,
        message: 'Ошибка при обработке заказа',
        error: error.message,
        code: error.code
      };
      statusCode = 500;
    }
    
  } finally {
    // ГАРАНТИРУЕМ что всегда возвращаем валидный JSON
    console.log('Возвращаем ответ:', responseData);
    return NextResponse.json(responseData, { status: statusCode });
  }
}