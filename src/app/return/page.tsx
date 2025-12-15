'use client';

import { useEffect, useState, Suspense } from 'react';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type PaymentStatus = 'verifying' | 'success' | 'error';

interface PaymentVerificationResponse {
  paid: boolean;
  error?: string;
}

function ReturnContent() {
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const orderId = searchParams.get('id');
    
    if (!orderId) {
      setStatus('error');
      setError('ID-ul comenzii lipsește din URL');
      return;
    }

    const verifyPayment = async () => {
      console.log('Verific comanda:', orderId);
      
      try {
        // Direct call to the production endpoint
        const response = await fetch(`https://n8n.ciocan.eu/webhook/d38f0d41-dbc2-4fa8-b2a4-91d26b1b551c?id=${orderId}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const data: PaymentVerificationResponse = await response.json();
        console.log('Raspuns server:', data);

        if (!response.ok) {
          throw new Error('Eroare la răspunsul serverului');
        }

        if (data.paid === true) {
          setStatus('success');
        } else {
          throw new Error('Plata nu a fost confirmată');
        }
      } catch (err) {
        console.error('Eroare la verificarea plății:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Eroare la verificare. Contactează suportul.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verificăm statusul plății...
            </h1>
            <p className="text-gray-600">Te rugăm să aștepți câteva momente.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6 text-green-500">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Plată reușită!</h1>
            <p className="text-gray-600 mb-6">Ți-am trimis emailul cu articolul tău.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Mergi la pagina principală
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center text-red-500">
              <XCircle className="h-16 w-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Plata nu a fost confirmată</h1>
            <p className="text-gray-600">{error}</p>
            <div className="pt-4">
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <span>Încearcă din nou</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturn() {
  return (
    <Suspense fallback={<div>Se încarcă...</div>}>
      <ReturnContent />
    </Suspense>
  );
}
