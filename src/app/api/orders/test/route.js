import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true, // 465 порт требует secure: true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Тестовое письмо
    const mailOptions = {
      from: `"Truck Import" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_EMAIL,
      subject: 'Тестовое письмо с сайта',
      text: 'Это тестовое письмо. Если вы его получили, значит почта работает!',
      html: '<h1>Тестовое письмо</h1><p>Если вы его получили, значит почта работает!</p>'
    };

    console.log('Отправляем тестовое письмо...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Письмо отправлено:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Тестовое письмо отправлено успешно',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Ошибка отправки тестового письма:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка отправки тестового письма',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}