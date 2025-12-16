'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Mail, Lock, CheckCircle, ArrowRight, Loader2, Eye, CreditCard, Youtube, FileText, Sparkles, X, User, Phone } from 'lucide-react'
import Image from 'next/image'

interface NetopiaData {
  action: string
  env_key: string
  data: string
}

interface ApiResponse {
  titlu: string
  intro: string
  poza_preview: string
  id_comanda: string
  netopia?: NetopiaData
  payment_link?: string // Fallback pentru compatibilitate
}

interface N8nResponse {
  status: string
  id_comanda: string
  titlu: string
  intro: string
  poza_preview: string
  netopia?: NetopiaData
  payment_link?: string
}

// Funcție pentru validare URL YouTube
const isValidYouTubeUrl = (url: string): boolean => {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^https?:\/\/youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/
  ]
  return patterns.some(pattern => pattern.test(url))
}

// Funcție pentru validare email
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [emailMatchError, setEmailMatchError] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    youtubeUrl: '',
    email: '',
    confirmEmail: '',
    terms: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [isPromoCodeUsed, setIsPromoCodeUsed] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: '',
    email: '',
    phone: '',
    articlesPerMonth: '1-5',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Scroll automat către preview când apare
  useEffect(() => {
    if (showPreview && previewRef.current && !showLoadingScreen) {
      // Folosim requestAnimationFrame pentru a ne asigura că DOM-ul este actualizat
      const scrollToPreview = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (previewRef.current) {
              previewRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              })
            }
          })
        })
      }
      
      // Delay pentru a permite animației să înceapă și elementului să fie complet renderat
      const scrollTimeout = setTimeout(scrollToPreview, 800)
      
      return () => clearTimeout(scrollTimeout)
    }
  }, [showPreview, showLoadingScreen])

  // Validare emailuri identice
  useEffect(() => {
    if (confirmEmail && email !== confirmEmail) {
      setEmailMatchError('Emailurile nu corespund')
    } else {
      setEmailMatchError('')
    }
  }, [email, confirmEmail])

  const handleGeneratePreview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailMatchError('')

    // Resetăm erorile
    setFieldErrors({
      youtubeUrl: '',
      email: '',
      confirmEmail: '',
      terms: ''
    })

    let hasErrors = false
    const newErrors = {
      youtubeUrl: '',
      email: '',
      confirmEmail: '',
      terms: ''
    }

    // Validări individuale
    if (!youtubeUrl.trim()) {
      newErrors.youtubeUrl = 'Câmp obligatoriu'
      hasErrors = true
    } else if (!isValidYouTubeUrl(youtubeUrl)) {
      newErrors.youtubeUrl = 'Link YouTube invalid'
      hasErrors = true
    }

    if (!email.trim()) {
      newErrors.email = 'Câmp obligatoriu'
      hasErrors = true
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email invalid'
      hasErrors = true
    }

    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = 'Câmp obligatoriu'
      hasErrors = true
    } else if (email !== confirmEmail) {
      newErrors.confirmEmail = 'Emailurile nu corespund'
      hasErrors = true
    }

    if (!acceptTerms) {
      newErrors.terms = 'Trebuie să accepți termenii'
      hasErrors = true
    }

    if (hasErrors) {
      setFieldErrors(newErrors)
      return
    }
    
    if (!process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      setError('Eroare de configurare. Vă rugăm contactați administratorul.')
      console.error('NEXT_PUBLIC_N8N_WEBHOOK_URL nu este configurat în variabilele de mediu')
      return
    }


    setIsLoading(true)
    setShowLoadingScreen(true)
    setLoadingProgress(0)
    setCurrentStep('Se pregătește cererea...')

    const startTime = Date.now()
    const expectedDuration = 48000 // 48 secunde
    const updateInterval = 100 // Actualizare la fiecare 100ms pentru smoothness

    // Bara de progres realistă bazată pe timp
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(95, (elapsed / expectedDuration) * 100)
      setLoadingProgress(progress)

      // Actualizări de step bazate pe progres
      if (progress < 20) {
        setCurrentStep('Analizăm video-ul YouTube...')
      } else if (progress < 40) {
        setCurrentStep('Extragem transcriptul...')
      } else if (progress < 60) {
        setCurrentStep('Generăm articolul cu AI...')
      } else if (progress < 80) {
        setCurrentStep('Cream imaginea unică...')
      } else {
        setCurrentStep('Finalizăm detaliile...')
      }
    }, updateInterval)

    try {
      // GET request către webhook-ul n8n (webhook-ul acceptă doar GET)
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      const params = new URLSearchParams({
        youtube_url: youtubeUrl,
        email: email,
        ...(promoCode && { promo_code: promoCode }) // Add promo_code only if it's not empty
      });
      
      const response = await fetch(`${webhookUrl}?${params}`, {
        method: 'GET'
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Eroare server: ${response.status}`)
      }

      // Verificăm dacă răspunsul este valid
      const responseText = await response.text()
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Linkul nu este valid, încercă cu un alt link.')
      }
      
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Răspuns invalid de la server - nu este JSON valid');
      }

      // Verificăm dacă este o eroare de la server (cum ar fi cod promoțional expirat)
      if (responseData.status === 'error') {
        clearInterval(progressInterval);
        setShowLoadingScreen(false);
        setIsLoading(false);
        setError(responseData.message || 'A apărut o eroare la verificarea codului promoțional');
        return;
      }
      
      // Verificăm dacă e cazul de cod promoțional gratuit
      if (responseData.payment_required === false) {
        clearInterval(progressInterval);
        setShowLoadingScreen(false);
        setIsLoading(false);
        setIsPromoCodeUsed(true);
        
        // Afișăm mesajul de succes cu detaliile articolului
        setApiResponse({
          titlu: responseData.data?.titlu || 'Articolul tău',
          intro: responseData.data?.intro || responseData.message || 'Gata! Ți-am trimis articolul pe email.',
          poza_preview: responseData.data?.poza || '',
          id_comanda: ''
        });
        setShowPreview(true);
        return;
      } else {
        setIsPromoCodeUsed(false);
      }
      
      // Dacă ajungem aici, continuăm cu fluxul normal de plată
      let n8nData: N8nResponse[] | N8nResponse = responseData;
      
      // Verificăm dacă avem date valide (array sau obiect singur)
      let firstResult: N8nResponse;
      if (Array.isArray(n8nData)) {
        if (n8nData.length === 0) {
          throw new Error('Array gol primit de la server');
        }
        firstResult = n8nData[0];
      } else {
        firstResult = n8nData;
      }
      
      // Verificăm dacă obiectul are câmpurile necesare
      if (!firstResult || !firstResult.titlu) {
        console.error('Invalid firstResult:', firstResult);
        throw new Error('Date incomplete primite de la server');
      }
      
      // Transformăm datele din n8n în formatul nostru
      const data: ApiResponse = {
        titlu: firstResult.titlu,
        intro: firstResult.intro,
        poza_preview: firstResult.poza_preview,
        id_comanda: firstResult.id_comanda,
        netopia: firstResult.netopia,
        payment_link: firstResult.payment_link // Fallback pentru compatibilitate
      }
      
      clearInterval(progressInterval)
      setLoadingProgress(100)
      setCurrentStep('Gata!')
      
      // Așteptăm puțin pentru a arăta 100% înainte de tranziție
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setApiResponse(data)
      setShowPreview(true)
      setShowLoadingScreen(false)
      setIsLoading(false)
    } catch (err) {
      clearInterval(progressInterval)
      const errorMessage = err instanceof Error ? err.message : 'A apărut o eroare neașteptată'
      setError(errorMessage.includes('server') ? errorMessage : 'A apărut o eroare. Te rugăm încearcă din nou.')
      console.error(err)
      setShowLoadingScreen(false)
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }

  const handlePayment = () => {
    // Verificăm dacă avem date Netopia
    if (apiResponse?.netopia?.action && apiResponse.netopia.env_key && apiResponse.netopia.data) {
      // Normalizăm URL-ul de action pentru Netopia
      let actionUrl = apiResponse.netopia.action
      
      // Corectăm URL-ul dacă este greșit (HTTP -> HTTPS, sau cale greșită)
      if (actionUrl.includes('sandboxsecure.mobilpay.ro')) {
        // Dacă conține calea greșită, o înlocuim
        if (actionUrl.includes('/eng/payment/pa/payment.php') || actionUrl.includes('/payment/pa/payment.php')) {
          actionUrl = 'https://sandboxsecure.mobilpay.ro/en'
        } else if (!actionUrl.startsWith('https://')) {
          // Dacă este HTTP, îl schimbăm în HTTPS
          actionUrl = actionUrl.replace('http://', 'https://')
          // Dacă nu are limba, adăugăm /en pentru engleză
          if (!actionUrl.includes('/en') && !actionUrl.includes('/ro')) {
            actionUrl = actionUrl.replace('sandboxsecure.mobilpay.ro', 'sandboxsecure.mobilpay.ro/en')
          }
        }
      }
      
      // Creăm un formular ascuns pentru Netopia
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = actionUrl
      form.acceptCharset = 'utf-8'
      
      // Adăugăm câmpurile necesare
      const envKeyInput = document.createElement('input')
      envKeyInput.type = 'hidden'
      envKeyInput.name = 'env_key'
      envKeyInput.value = apiResponse.netopia.env_key
      form.appendChild(envKeyInput)
      
      const dataInput = document.createElement('input')
      dataInput.type = 'hidden'
      dataInput.name = 'data'
      dataInput.value = apiResponse.netopia.data
      form.appendChild(dataInput)
      
      // Adăugăm formularul la body și îl trimitem
      document.body.appendChild(form)
      form.submit()
    } else if (apiResponse?.payment_link) {
      // Fallback pentru link direct (dacă există)
      window.location.href = apiResponse.payment_link
    } else {
      setError('Date de plată incomplete. Te rugăm încearcă din nou.')
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Loading Screen Overlay */}
      {showLoadingScreen && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="max-w-md w-full px-6 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Se generează articolul...
              </h2>
              <p className="text-gray-600 mb-4">
                Transformăm video-ul tău într-un articol de blog captivant
              </p>
              {currentStep && (
                <p className="text-sm text-blue-600 font-medium animate-pulse">
                  {currentStep}
                </p>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Procesare</span>
                <span className="font-semibold">{Math.min(100, Math.round(loadingProgress))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${loadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loadingProgress > 10 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Analizăm video-ul YouTube</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loadingProgress > 30 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Extragem transcriptul</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loadingProgress > 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Generăm articolul cu AI</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loadingProgress > 70 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Cream imaginea unică</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative px-4 pt-12 pb-16 sm:px-6 lg:px-8 max-w-full bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight px-2">
            Transformă Video în Blog Viral
            <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">în sub 60 de secunde</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto px-2">
            Nu pierde timpul scriind. Pune link-ul YouTube și primești articolul + poză unică pe email.
          </p>

          <form onSubmit={handleGeneratePreview} className="space-y-6 max-w-md mx-auto w-full px-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
            <div className="relative">
              <Play className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Lipește link-ul YouTube aici..."
                className={`w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.youtubeUrl ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              {fieldErrors.youtubeUrl && (
                <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                  {fieldErrors.youtubeUrl}
                </div>
              )}
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresa ta de email"
                className={`w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              {fieldErrors.email && (
                <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                  {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirmă Email"
                className={`w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.confirmEmail ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              {fieldErrors.confirmEmail && (
                <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                  {fieldErrors.confirmEmail}
                </div>
              )}
            </div>

            {emailMatchError && (
              <div className="text-red-500 text-sm text-center">
                {emailMatchError}
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Ai un Cod Promo? (Opțional)"
                className="w-full pl-4 pr-4 py-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mt-2"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="flex items-start space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={`mt-1 w-4 h-4 text-red-600 bg-gray-100 rounded focus:ring-2 ${
                    fieldErrors.terms ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                  }`}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className={`text-sm leading-relaxed ${
                  fieldErrors.terms ? 'text-red-600' : 'text-gray-600'
                }`}>
                  Sunt de acord cu 
                  <a 
                    href="/termeni-si-conditii" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 underline ml-1"
                  >
                    Termenii și Condițiile
                  </a>
                </label>
              </div>
              {fieldErrors.terms && (
                <div className="text-red-500 text-sm mt-1">
                  {fieldErrors.terms}
                </div>
              )}
            </div>

            {/* Verificăm dacă butonul trebuie să fie dezactivat */}
            {(() => {
              const emailsMatch = email === confirmEmail && email !== '' && confirmEmail !== ''
              const isValid = isValidYouTubeUrl(youtubeUrl) && isValidEmail(email) && emailsMatch && acceptTerms
              const isDisabled = isLoading || !isValid
              
              return (
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:via-rose-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg sm:text-xl ${!isDisabled && !isLoading ? 'animate-pulse-button' : ''}`}
                >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-lg sm:text-xl">Se generează...</span>
                </>
              ) : (
                <>
                  <span className="text-lg sm:text-xl">Generează Previzualizarea Gratuită</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
                </button>
              )
            })()}
          </form>
        </div>
      </div>

      {/* Cum Funcționează */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12 px-2">
            Cum funcționează
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 px-2">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Youtube className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pas 1: Pui Link-ul</h3>
              <p className="text-gray-600">Adaugi link-ul YouTube și email-ul tău în formular</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pas 2: Vezi Previzualizarea</h3>
              <p className="text-gray-600">Primești instant titlul și introducerea articolului</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pas 3: Deblochezi articolul și poza cu doar 5 RON</h3>
              <p className="text-gray-600 mb-2">Primești tot articolul + poza unică pe email instant</p>
              <p className="text-sm text-gray-500 font-medium">Fără abonament lunar. Plătești doar ce folosești.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Previzualizare */}
      {showPreview && apiResponse && (
        <div 
          ref={previewRef}
          className="px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-full overflow-x-hidden"
        >
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
              {/* Imagine cu watermark */}
              <div className="relative h-96 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {apiResponse.poza_preview && (
                      <>
                        <img
                          src={apiResponse.poza_preview}
                          alt="Preview imagine"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                            <Lock className="w-6 h-6 text-gray-700" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          PREVIEW
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Conținut articol */}
              <div className="p-4 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 break-words">
                  {apiResponse.titlu}
                </h2>
                
                <div className="prose prose-lg max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {apiResponse.intro}
                  </p>
                </div>

                {!isPromoCodeUsed ? (
                  <>
                    {/* Text blocat cu blur - doar dacă nu e cod promoțional */}
                    <div className="relative">
                      <div className="bg-gray-100 rounded-lg p-6 backdrop-blur-sm">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                      </div>
                      <div className="text-center mt-4">
                        <span className="text-gray-500 text-sm">
                          Articolul continuă... deblochează conținutul complet
                        </span>
                      </div>
                    </div>

                    {/* Buton de plată - doar dacă nu e cod promoțional */}
                    <div className="mt-8 text-center px-2">
                      <button
                        onClick={handlePayment}
                        className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:via-rose-700 hover:to-pink-700 text-white font-bold py-4 px-4 sm:px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 mx-auto text-sm sm:text-base w-full sm:w-auto justify-center shadow-lg hover:shadow-xl"
                      >
                        <CreditCard className="w-5 h-5 flex-shrink-0" />
                        <span className="break-words">Deblochează tot articolul pentru 5 RON</span>
                      </button>
                      <p className="text-gray-500 text-xs sm:text-sm mt-3 px-2">
                        Plată securizată prin Netopia • Primești totul instant pe email
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center text-green-700">
                      <CheckCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                      <span className="font-medium">Cod acceptat! ✅ Articolul a fost generat și trimis pe email!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Form Modal */}
      {showSubscriptionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            <button 
              onClick={() => {
                setShowSubscriptionForm(false)
                setSubmitStatus(null)
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Solicită ofertă de abonament</h3>
              
              {submitStatus ? (
                <div className={`p-4 rounded-lg ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  
                  try {
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(subscriptionForm),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.message || 'Eroare la trimiterea cererii');
                    }

                    setSubmitStatus({
                      success: true,
                      message: data.message
                    });
                    
                    // Reset form
                    setSubscriptionForm({
                      name: '',
                      email: '',
                      phone: '',
                      articlesPerMonth: '1-5',
                      message: ''
                    });
                    
                    // Close form after 3 seconds
                    setTimeout(() => {
                      setShowSubscriptionForm(false);
                      setSubmitStatus(null);
                    }, 3000);
                    
                  } catch (error) {
                    console.error('Error submitting form:', error);
                    setSubmitStatus({
                      success: false,
                      message: error instanceof Error ? error.message : 'A apărut o eroare la trimiterea cererii. Te rugăm să încerci din nou mai târziu.'
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nume complet *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          required
                          value={subscriptionForm.name}
                          onChange={(e) => setSubscriptionForm({...subscriptionForm, name: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Introdu numele tău"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          required
                          value={subscriptionForm.email}
                          onChange={(e) => setSubscriptionForm({...subscriptionForm, email: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="email@exemplu.ro"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Număr de telefon (opțional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={subscriptionForm.phone}
                          onChange={(e) => setSubscriptionForm({...subscriptionForm, phone: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="+40 7__ ___ ___"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="articlesPerMonth" className="block text-sm font-medium text-gray-700 mb-1">
                        Număr de articole pe lună *
                      </label>
                      <select
                        id="articlesPerMonth"
                        required
                        value={subscriptionForm.articlesPerMonth}
                        onChange={(e) => setSubscriptionForm({...subscriptionForm, articlesPerMonth: e.target.value})}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="1-5">1-5 articole/lună</option>
                        <option value="5-10">5-10 articole/lună</option>
                        <option value="10-20">10-20 articole/lună</option>
                        <option value="20+">Peste 20 de articole/lună</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Mesaj (opțional)
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={subscriptionForm.message}
                        onChange={(e) => setSubscriptionForm({...subscriptionForm, message: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Ai întrebări speciale sau cerințe specifice?"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            Se trimite...
                          </>
                        ) : (
                          <>
                            <Mail className="h-5 w-5" />
                            Trimite cerere
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Prin trimiterea acestui formular, sunteți de acord cu prelucrarea datelor dumneavoastră conform 
                      <a href="/termeni-si-conditii" className="text-red-600 hover:underline ml-1">Politicii de Confidențialitate</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200 max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-6 text-center">
            <button 
              onClick={() => setShowSubscriptionForm(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="mr-2">📩</span> Vrei ofertă abonament? Trimite solicitare
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-4">
            <a
              href="/despre-noi"
              className="text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              Despre Noi
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="/termeni-si-conditii"
              className="text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              Termeni și Condiții
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-600 text-xs sm:text-sm">
              © {new Date().getFullYear()} YouTube to Blog
            </span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm text-center px-2">
            Transformăm conținut video în articole de blog.
          </p>
        </div>
      </div>
    </div>
  )
}
