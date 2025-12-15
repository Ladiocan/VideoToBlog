import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json(
      { error: 'ID-ul comenzii este necesar' },
      { status: 400 }
    );
  }

  try {
    const webhookUrl = process.env.NEXT_PUBLIC_PAYMENT_VERIFICATION_WEBHOOK;
    if (!webhookUrl) {
      throw new Error('Payment verification webhook URL is not configured');
    }

    const response = await fetch(
      `${webhookUrl}?orderId=${orderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        next: { revalidate: 0 } // Ensure we don't get cached responses
      }
    );

    if (!response.ok) {
      console.error('Eroare la verificarea plății:', await response.text());
      return NextResponse.json(
        { 
          paid: false,
          error: 'Eroare la verificarea stării plății. Vă rugăm încercați din nou.'
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    
    // Ensure we have a proper response format
    if (typeof data.paid === 'boolean') {
      return NextResponse.json({ paid: data.paid });
    }
    
    // If the response doesn't match expected format, log it and return not paid
    console.error('Format răspuns neașteptat de la server:', data);
    return NextResponse.json({ 
      paid: false,
      error: 'Format de răspuns neașteptat de la server'
    });
    
  } catch (error) {
    console.error('Eroare la verificarea plății:', error);
    return NextResponse.json(
      { 
        paid: false,
        error: 'A apărut o eroare la verificarea plății. Te rugăm să încerci din nou.'
      },
      { status: 200 }
    );
  }
}
