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
    const { name, email, phone, articlesPerMonth, message } = body;

    if (!SENDGRID_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Configurare incompletă a serverului' },
        { status: 500 }
      );
    }

    // Verifică dacă toate câmpurile obligatorii sunt prezente
    if (!name || !email || !articlesPerMonth) {
      return NextResponse.json(
        { success: false, message: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      );
    }

    // Construiește conținutul email-ului
    const emailContent = `
      <h2>Cerere nouă de ofertă abonament</h2>
      <p><strong>Nume:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || 'Nespecificat'}</p>
      <p><strong>Articole pe lună:</strong> ${articlesPerMonth}</p>
      ${message ? `<p><strong>Mesaj:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <p><em>Acest mesaj a fost trimis de pe formularul de contact de pe site-ul VideoToBlog.</em></p>
    `;

    // Configurează email-ul
    const msg = {
      to: SENDGRID_TO_EMAIL,
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: 'VideoToBlog - Formular Contact',
      },
      replyTo: email,
      subject: `[VideoToBlog] Cerere ofertă abonament de la ${name}`,
      html: emailContent,
    };

    // Trimite email-ul
    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: 'Cererea ta a fost trimisă cu succes! Te vom contacta în curând cu o ofertă personalizată.',
    });

  } catch (error: unknown) {
    console.error('Eroare la trimiterea email-ului:', error);
    
    // Gestionează erorile specifice SendGrid
    if (error && typeof error === 'object' && 'response' in error) {
      const sendGridError = error as { response?: { body?: unknown } };
      console.error('Detalii eroare SendGrid:', sendGridError.response?.body);
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'A apărut o eroare la trimiterea cererii. Te rugăm să încerci din nou mai târziu sau să ne contactezi direct la contact@videotoblog.ro' 
      },
      { status: 500 }
    );
  }
}
