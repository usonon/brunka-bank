import { Shield, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function ServicesSection() {
  const [, setLocation] = useLocation();

  const services = [
    {
      icon: Shield,
      title: 'Assurance',
      description: 'Protégez votre logement, votre véhicule et vos proches avec des formules adaptées à votre situation.',
      link: '/assurance',
    },
    {
      icon: TrendingUp,
      title: 'Placements',
      description: 'Découvrez nos solutions de placement et suivez l\'évolution de votre épargne depuis votre espace.',
      link: '/epargne',
    },
    {
      icon: PiggyBank,
      title: 'Épargne retraite',
      description: 'Préparez votre retraite avec nos guides pratiques et notre simulateur.',
      link: '/retirement-guide',
    },
    {
      icon: CreditCard,
      title: 'Cartes bancaires',
      description: 'Comparez nos cartes selon vos usages : frais annuels, avantages et services associés.',
      link: '/card-comparator',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
            Des services pour tous vos besoins
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow-sm">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-purple-600 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{service.description}</p>
                <Button
                  onClick={() => setLocation(service.link)}
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold p-0"
                >
                  En savoir plus →
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
