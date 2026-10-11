import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { PhoneIllustration } from '@/components/Illustrations';

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="bg-gradient-to-br from-white via-white to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center">
            <p className="text-amber-500 font-semibold text-sm md:text-base mb-4">Simple. Clair. Pratique.</p>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-600 mb-6 leading-tight">
              Effectuez toutes vos opérations bancaires au même endroit, en toute commodité.
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Suivez vos comptes, préparez vos projets et utilisez des outils de simulation pour mieux gérer votre argent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setLocation('/signup')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6 rounded-lg text-base"
              >
                Devenir Client
              </Button>
              <Button
                onClick={() => setLocation('/login')}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-6 rounded-lg text-base"
              >
                Se Connecter
              </Button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-400 rounded-full opacity-15 blur-3xl"></div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-300 rounded-full opacity-15 blur-3xl"></div>
              <PhoneIllustration className="relative z-10 max-w-xs w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
