import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { SupportIllustration } from '@/components/Illustrations';

export default function RecommendationSection() {
  const [, setLocation] = useLocation();

  const points = [
    'Des simulateurs gratuits pour estimer vos mensualités, votre retraite ou votre fiscalité.',
    'Des guides pratiques pour comprendre vos options avant de vous engager.',
    'Une équipe joignable par e-mail et par téléphone pour répondre à vos questions.',
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center">
            <p className="text-amber-500 font-semibold text-sm md:text-base mb-4">Accompagnement</p>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
              Un accompagnement à chaque étape
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Avant, pendant et après votre souscription, nous mettons à votre disposition des outils et des informations pour décider en connaissance de cause.
            </p>

            <div className="space-y-4 mb-8">
              {points.map((point) => (
                <div key={point} className="flex items-start">
                  <span className="flex items-center justify-center h-6 w-6 rounded-md bg-purple-600 text-white flex-shrink-0">✓</span>
                  <p className="ml-3 text-gray-700">{point}</p>
                </div>
              ))}
            </div>

            <div>
              <Button
                onClick={() => setLocation('/contact')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6"
              >
                Nous contacter
              </Button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <SupportIllustration className="max-w-lg w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
