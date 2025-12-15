import { Play, Mail, CheckCircle, ArrowRight, Youtube, FileText, Sparkles, Users, Target, Zap } from 'lucide-react'

export default function DespreNoi() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative px-4 pt-12 pb-16 sm:px-6 lg:px-8 max-w-full">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight px-2">
            Mai mult Conținut.
            <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Mai puțin Stres.</span>
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-8 max-w-2xl mx-auto px-2">
            Povestea VideoToBlog
          </h2>
          
          <div className="max-w-3xl mx-auto text-left space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Știm cât de mult muncești pentru fiecare videoclip. Ore de filmare, zile de editare, stresul algoritmului... Iar la final, după ce apeși "Publish", îți dorești ca mesajul tău să ajungă la cât mai mulți oameni.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Dar să te așezi să scrii un articol de blog de la zero, după tot acest efort? Este epuizant. Aici intervenim noi.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* What is VideoToBlog */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Ce este VideoToBlog?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            VideoToBlog nu este doar un simplu instrument de transcriere. Este asistentul tău editorial inteligent. Folosim cea mai avansată tehnologie AI pentru a transforma instantaneu orice link YouTube într-un articol de blog complet, structurat și optimizat SEO.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Misiunea Noastră
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Credem că o idee bună nu trebuie să rămână blocată doar pe YouTube. Misiunea noastră este să te ajutăm să practici Reciclarea Inteligentă a Conținutului. Transformăm vocea ta în text valoros, gata să fie descoperit pe Google.
          </p>
        </div>

        {/* Why we created this */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            De ce am creat această platformă?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pentru Viteză:</h3>
                <p className="text-gray-600">
                  Ceea ce dura 3 ore de scris, acum durează sub 60 de secunde.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pentru Calitate:</h3>
                <p className="text-gray-600">
                  AI-ul nostru nu doar traduce, ci adaptează tonul, corectează gramatica și extrage esența.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pentru Creștere:</h3>
                <p className="text-gray-600">
                  Îți oferim instrumentele (text + imagini unice) pentru a domina nu doar YouTube, ci și căutările Google.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-900 mb-6">
              Nu lăsa conținutul tău să expire. Dă-i o nouă viață.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Transformă primul tău video acum.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105"
            >
              Începe Acum
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
