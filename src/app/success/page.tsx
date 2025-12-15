'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, Loader2, Home } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type PaymentStatus = 'verifying' | 'success' | 'error'

interface PaymentStatusResponse {
  status: string
  error?: string
}

export default function SuccessPage() {
  const [status, setStatus] = useState<PaymentStatus>('verifying')
  const [error, setError] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Extract orderId from URL parameters
    const id = searchParams.get('orderId') || 
               searchParams.get('order_id') || 
               searchParams.get('client_reference_id') ||
               searchParams.get('id')
    
    if (!id) {
      setStatus('error')
      setError('ID-ul comenzii lipsește din URL')
      return
    }

    setOrderId(id)

    const verifyPayment = async () => {
      try {
        console.log('Verific comanda:', id)
        
        const webhookUrl = process.env.NEXT_PUBLIC_PAYMENT_VERIFICATION_WEBHOOK
        if (!webhookUrl) {
          throw new Error('Payment verification webhook URL is not configured')
        }

        const response = await fetch(`${webhookUrl}?id=${id}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })

        const data: PaymentStatusResponse = await response.json()
        console.log('API Response:', data)

        if (!response.ok) {
          throw new Error('Eroare la răspunsul serverului')
        }

        if (data.status === 'Paid') {
          setStatus('success')
        } else {
          setStatus('error')
          setError(`Plata nu a fost confirmată. Status: ${data.status}`)
        }
      } catch (err) {
        console.error('Eroare la verificarea plății:', err)
        setStatus('error')
        setError('Eroare la verificare. Te rugăm să contactezi suportul.')
      }
    }

    verifyPayment()
  }, [searchParams])

  const handleRetry = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verificăm securitatea plății...
            </h1>
            <p className="text-gray-600">Te rugăm să aștepți câteva momente.</p>
          </>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center text-green-500">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Plată confirmată cu succes!</h1>
            <div className="text-lg font-semibold text-green-600 bg-green-50 p-3 rounded-lg">
              ID Comandă: {orderId}
            </div>
            <p className="text-gray-600">
              Ți-am trimis articolul pe email. Dacă nu l-ai primit în 5 minute, contactează-ne cu ID-ul comenzii.
            </p>
            <div className="pt-4 space-y-3">
              <a 
                href="mailto:contact@videotoblog.ro?subject=Problema cu comanda&body=ID Comandă: " 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Contactează Suportul
              </a>
              <Link 
                href="/"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Generează Alt Articol
              </Link>
            </div>
          </div>
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
  )
}
