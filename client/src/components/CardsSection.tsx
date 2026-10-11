import { useLocation } from 'wouter';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardsIllustration } from '@/components/Illustrations';

const cards = [
  {
    title: 'Carte Essentielle',
    features: ['Pour les paiements du quotidien', 'Frais annuels : voir le comparateur'],
  },
  {
    title: 'Carte Premium',
    features: ['Pour les clients qui voyagent et consomment davantage', 'Assurances et services associés : voir le comparateur'],
  },
];

export default function CardsSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:justify-start">
            <CardsIllustration className="max-w-sm w-full h-auto rounded-lg" />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-amber-500 font-semibold text-sm md:text-base mb-4">Vos cartes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
              Trouvez la carte bancaire qui vous correspond
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Une gamme de cartes bancaires et de services associés pour faciliter votre quotidien.
            </p>

            <div className="space-y-6 mb-8">
              {cards.map((card) => (
                <div key={card.title} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-purple-600 mb-4">{card.title}</h3>
                  <div className="space-y-3">
                    {card.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Button
                onClick={() => setLocation('/card-comparator')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6"
              >
                Comparer les cartes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
