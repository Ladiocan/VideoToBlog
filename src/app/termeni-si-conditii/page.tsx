import { ArrowRight, Shield, Users, CreditCard, FileText, Mail, CheckCircle, AlertTriangle, Clock, Lock } from 'lucide-react'

export default function TermeniSiConditii() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative px-4 pt-12 pb-16 sm:px-6 lg:px-8 max-w-full">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 leading-tight px-2">
            TERMENI ȘI CONDIȚII
            <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">DE UTILIZARE</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto px-2">
            Ultima actualizare: 14 Decembrie 2024
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Accesarea și utilizarea acestui website presupune acceptarea automată a termenilor și condițiilor de mai jos. Dacă nu sunteți de acord cu acești termeni, vă rugăm să încetați utilizarea serviciilor noastre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8">
          {/* Identification */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Identificarea Prestatorului</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Serviciul este oferit de:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><span className="font-semibold">Denumire Comercială:</span> Sc Turist in Transilvania srl</li>
              <li><span className="font-semibold">Cod Unic de Înregistrare (CUI):</span> 31260752</li>
              <li><span className="font-semibold">Nr. Reg. Comerțului:</span> J32/158/2013</li>
              <li><span className="font-semibold">Sediul Social:</span> str. Stadionului 14, Mediaș, jud. Sibiu</li>
              <li><span className="font-semibold">Email de contact:</span> contact@videotoblog.ro</li>
            </ul>
          </div>

          {/* Service Description */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">2. Descrierea Serviciului</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              VideoToBlog.ro este un serviciu online (SaaS) care utilizează Inteligența Artificială (AI) pentru a transforma conținutul video (link-uri YouTube) în articole de blog scrise.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold">Livrare:</span> Articolele sunt generate automat și livrate pe adresa de email furnizată de utilizator.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold">Format:</span> Utilizatorul primește textul articolului (format HTML/Text) și o imagine generată de AI.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">3. Proprietate Intelectuală și Drepturi de Autor</h2>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1. Conținutul Generat</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              După efectuarea plății integrale, Utilizatorul primește drepturi depline de utilizare comercială asupra articolului și imaginii generate. Puteți publica articolul pe blogul propriu, rețele sociale sau în alte scopuri comerciale.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2. Responsabilitatea Utilizatorului</h3>
            <p className="text-gray-600 leading-relaxed">
              Utilizatorul declară pe propria răspundere că deține drepturile asupra videoclipului YouTube introdus sau are permisiunea de a-l procesa. VideoToBlog.ro nu își asumă răspunderea pentru încălcarea drepturilor de autor dacă utilizatorul procesează conținut care nu îi aparține.
            </p>
          </div>

          {/* Responsabilitățile Utilizatorului */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">3. Responsabilitățile Utilizatorului</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ca utilizator al serviciului VideoToBlog, sunteți responsabil pentru:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Aveți drepturile necesare asupra conținutului video pe care îl procesați</li>
              <li>Furnizați o adresă de email validă pentru a primi rezultatele</li>
              <li>Respectați drepturile de autor și legile aplicabile</li>
              <li>Nu utilizați serviciul pentru conținut ilegal, ofensator sau dăunător</li>
            </ul>
          </div>

          {/* Prices and Payment */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">4. Prețuri și Plată</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold">Preț:</span> Costul serviciului este de 5 RON per articol generat.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold">Metoda de Plată:</span> Plățile sunt procesate securizat prin partenerul nostru Netopia Payments. Noi nu stocăm datele cardului dumneavoastră.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold">Facturare:</span> Factura fiscală va fi emisă și trimisă electronic pe email după confirmarea plății.
            </p>
          </div>

          {/* Delivery and Return Policy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">5. Politica de Livrare și Retur (Refund)</h2>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1. Livrare</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Serviciul este livrat electronic. În mod normal, procesarea durează între 1 și 5 minute de la confirmarea plății.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2. Excepții de la Dreptul de Retragere</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Conform OUG 34/2014 (Art. 16, lit. m), furnizarea de conținut digital care nu este livrat pe un suport material este exceptată de la dreptul de retragere (retur) odată ce prestarea a început cu acordul consumatorului. Prin plasarea comenzii, confirmați că doriți livrarea imediată și pierdeți dreptul de retragere.
                  </p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">5.3. Garanția de Calitate (Refund Voluntar)</h3>
            <p className="text-gray-600 leading-relaxed mb-2">
              Cu toate acestea, dorim să fiți mulțumiți. Vă oferim returnarea banilor (Refund) în următoarele situații tehnice:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 mb-4">
              <li>Articolul nu a fost livrat deloc din cauza unei erori de sistem.</li>
              <li>Textul generat este complet incoerent sau într-o altă limbă decât cea a videoclipului.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Pentru solicitări de refund, scrieți-ne la <a href="mailto:contact@videotoblog.ro" className="text-red-600 hover:underline">contact@videotoblog.ro</a> în termen de 24 de ore.
            </p>
          </div>

          {/* Liability Disclaimer */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">6. Limitarea Răspunderii (Disclaimer AI)</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold">Acuratețe:</span> Serviciul folosește modele de limbaj AI (Llama/OpenAI). Deși tehnologia este avansată, AI-ul poate genera uneori informații inexacte ("halucinații"). Utilizatorul are obligația de a verifica veridicitatea informațiilor înainte de publicare.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold">Disponibilitate:</span> Nu garantăm funcționarea serviciului 100% din timp fără întreruperi, acesta depinzând de API-uri terțe (YouTube, OpenAI, AWS).
            </p>
          </div>

          {/* Data Storage */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">7. Stocarea Datelor</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold">Imagini:</span> Imaginile generate sunt stocate pe serverele noastre (AWS S3) pentru o perioadă de 45 de zile, după care sunt șterse automat. Vă recomandăm să le salvați local.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold">Confidențialitate:</span> Respectăm GDPR. Adresa de email este folosită strict pentru livrarea serviciului și comunicări tranzacționale. Nu vindem datele dumneavoastră. (Vezi Politica de Confidențialitate).
            </p>
          </div>

          {/* Applicable Law */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Legea Aplicabilă</h2>
            <p className="text-gray-600 leading-relaxed">
              Acești Termeni și Condiții sunt guvernați de legea română. Orice litigiu va fi soluționat pe cale amiabilă sau, în caz contrar, de instanțele competente din România.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pregătit să începi?
          </h2>
          <a
            href="/"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105"
          >
            Înapoi la Formular
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
