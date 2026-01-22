import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';


export async function POST(request) {
  let responseData;
  let statusCode = 200;
  
  try {

    const csrfHeader = request.headers.get('X-CSRF-Token');
    const cookieStore = await cookies();
    const csrfCookie = cookieStore.get('csrf_token')?.value;
    
    if (!csrfHeader || csrfHeader !== csrfCookie) {
      console.error('CSRF validation failed');
      return NextResponse.json({
        success: false,
        message: 'CSRF token validation failed'
      }, { status: 403 });
    }
    
    // Пробуем прочитать тело запроса
    let formData;
    try {
      formData = await request.json();
      console.log('Получена форма обратной связи:', {
        name: formData.name,
        phone: formData.phone,
        timestamp: new Date().toISOString()
      });
    } catch (jsonError) {
      console.error('Ошибка парсинга JSON:', jsonError);
      responseData = {
        success: false,
        message: 'Неверный формат данных'
      };
      statusCode = 400;
      throw new Error('Invalid JSON');
    }

    // Валидация полей
    if (!formData.name || !formData.phone) {
      responseData = {
        success: false,
        message: 'Заполните имя и телефон'
      };
      statusCode = 400;
      throw new Error('Missing required fields');
    }

    // Если нет SMTP настроек, просто логируем
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log('SMTP не настроен, логируем заявку:', formData);
      
      responseData = {
        success: true,
        message: 'Заявка принята (SMTP не настроен)',
        note: 'Заявка записана в лог'
      };
      
      return NextResponse.json(responseData, { status: statusCode });
    }

    // Создаем транспортер для отправки почты
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Текст письма
    const mailText = `
НОВАЯ ЗАЯВКА С САЙТА TRUCK-IMPORT

════════════════════════════════════════
КОНТАКТНАЯ ИНФОРМАЦИЯ:
════════════════════════════════════════
• Имя: ${formData.name}
• Телефон: ${formData.phone}
• Согласие с политикой: ${formData.agreeToPrivacy ? 'ДА' : 'НЕТ'}

════════════════════════════════════════
ДЕТАЛИ:
════════════════════════════════════════
Тип: Обратная связь
Дата: ${new Date().toLocaleString('ru-RU')}
URL: ${formData.pageUrl || 'не указано'}
IP: ${request.headers.get('x-forwarded-for') || 'не доступно'}
    `;
    // HTML версия письма
    const mailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .info-item { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 3px; }
    .label { font-weight: bold; color: #2c3e50; }
  </style>
</head>
<body>
  <div class="header">
    <h2>НОВАЯ ЗАЯВКА С САЙТА TRUCK-IMPORT</h2>
    <p><strong>Тип:</strong> Обратная связь</p>
    <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
  </div>

  <h3>КОНТАКТНАЯ ИНФОРМАЦИЯ:</h3>
  
  <div class="info-item">
    <span class="label">Имя:</span> ${formData.name}
  </div>
  
  <div class="info-item">
    <span class="label">Телефон:</span> ${formData.phone}
  </div>

  <div class="info-item">
    <span class="label">Согласие с политикой:</span> ${formData.agreeToPrivacy ? 'ДА' : 'НЕТ'}
  </div>

  <div style="margin-top: 30px; padding: 15px; background: #e8f4fc; border-radius: 5px;">
    <p><strong>Дополнительная информация:</strong></p>
    <p><strong>URL страницы:</strong> ${formData.pageUrl || 'не указано'}</p>
    <p><strong>Время отправки:</strong> ${new Date().toLocaleString('ru-RU')}</p>
  </div>

  <p style="margin-top: 30px; font-size: 12px; color: #777;">
    Это письмо отправлено автоматически с сайта truck-import.ru
  </p>
</body>
</html>`;

    // Отправляем письмо
    // console.log('Отправляем письмо с заявкой...');
    
    const mailOptions = {
      from: `"Truck Import - Заявка" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_EMAIL || process.env.SMTP_USER,
      subject: `Новая заявка от ${formData.name}`,
      text: mailText,
      html: mailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log('Письмо с заявкой отправлено:', info.messageId);

    responseData = {
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    // console.error('Ошибка при отправке заявки:', error);
    
    // Подробная информация об ошибке
    let errorMessage = 'Ошибка при отправке заявки';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Ошибка авторизации почтового сервера';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Ошибка подключения к почтовому серверу';
    }
    
    responseData = {
      success: false,
      message: errorMessage,
      error: error.message
    };
    statusCode = 500;
    
  } finally {
    // ГАРАНТИРУЕМ что всегда возвращаем валидный JSON
    console.log('Возвращаем ответ на заявку:', responseData);
    return NextResponse.json(responseData, { status: statusCode });
  }
}