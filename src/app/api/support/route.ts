import { NextResponse } from 'next/server';
import * as sgMail from '@sendgrid/mail';

// Configurează cheia API SendGrid din variabilele de mediu
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'contact@videotoblog.ro';
const SENDGRID_TO_EMAIL = process.env.SENDGRID_TO_EMAIL || 'contact@videotoblog.ro';

if (!SENDGRID_API_KEY) {
  console.error('Eroare: Lipsește cheia API SendGrid din variabilele de mediu.');
}

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email, message } = body;

    if (!SENDGRID_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Configurare incompletă a serverului' },
        { status: 500 }
      );
    }

    // Verifică dacă toate câmpurile obligatorii sunt prezente
    if (!orderId || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      );
    }

    // Validează formatul email-ului
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Adresa de email nu este validă' },
        { status: 400 }
      );
    }

    // Construiește conținutul email-ului
    const emailContent = `
      <h2>Cerere de suport pentru comandă</h2>
      <p><strong>ID Comandă:</strong> ${orderId}</p>
      <p><strong>Email client:</strong> ${email}</p>
      <p><strong>Mesaj:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <p><em>Acest mesaj a fost trimis din pagina de succes a site-ului VideoToBlog.</em></p>
    `;

    // Configurează email-ul
    const msg = {
      to: SENDGRID_TO_EMAIL,
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: 'VideoToBlog - Suport',
      },
      replyTo: email,
      subject: `[VideoToBlog] Suport pentru comanda ${orderId}`,
      html: emailContent,
    };

    // Trimite email-ul
    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: 'Cererea de suport a fost trimisă cu succes! Te vom contacta în curând.',
    });

  } catch (error: unknown) {
    console.error('Eroare la trimiterea email-ului de suport:', error);
    
    // Gestionează erorile specifice SendGrid
    if (error && typeof error === 'object' && 'response' in error) {
      const sendGridError = error as { response?: { body?: unknown; status?: number } };
      console.error('Detalii eroare SendGrid:', {
        status: sendGridError.response?.status,
        body: sendGridError.response?.body
      });
      
      if (sendGridError.response?.status === 401) {
        console.error('SendGrid: Cheia API este invalidă sau expirată');
      } else if (sendGridError.response?.status === 403) {
        console.error('SendGrid: Acces interzis - verifică domeniul și autentificarea');
      } else if (sendGridError.response?.status === 429) {
        console.error('SendGrid: Rate limit depășit');
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'A apărut o eroare la trimiterea cererii. Te rugăm să încerci din nou mai târziu.' 
      },
      { status: 500 }
    );
  }
}
