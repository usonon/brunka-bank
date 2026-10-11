import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Home, PieChart } from 'lucide-react';

export default function ToolsSection() {
  const [, setLocation] = useLocation();
  const tools = [
    {
      icon: Calculator,
      title: 'Comparateur de cartes',
      description: 'Comparez les différentes caractéristiques de notre gamme de cartes bancaire.',
      link: '/card-comparator'
    },
    {
      icon: Home,
      title: 'Préparer votre retraite',
      description: 'Découvrir notre guide sur la retraite : loi PACTE, âge légal de départ, rachat de trimestre, …',
      link: '/retirement-guide'
    },
    {
      icon: TrendingUp,
      title: 'Simulateur de crédit immobilier',
      description: 'Vous avez un projet immobilier ? Faites une simulation du montant de votre emprunt ou des mensualités hors assurance.',
      link: '/mortgage-simulator'
    },
    {
      icon: PieChart,
      title: 'Simulateur impôt sur la fortune',
      description: 'Faites le point sur votre situation en terme de patrimoine immobilier taxable et estimez le montant de votre ifi.',
      link: '/wealth-tax-simulator'
    },
    {
      icon: Calculator,
      title: 'Simulateur retraite',
      description: 'Estimer le montant de votre future retraite, c\'est-à-dire le montant qui sera versé par les régimes obligatoires et l\'âge auquel vous le percevrez.',
      link: '/retirement-simulator'
    },
    {
      icon: Home,
      title: 'Découvrir le guide de l\'IFI',
      description: 'Notre guide constitue une première approche pour mieux comprendre l\'impôt sur la fortune immobilière et autres.',
      link: '/ifi-guide'
    }
  ];

  return (
    <section className="bg-purple-600 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-purple-200 font-semibold text-sm md:text-base mb-2">Vos besoins, nos outils</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            À vos côtés pour tous vos projets
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow-sm">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-purple-600 mb-3">
                  {tool.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
                
                <Button
                  onClick={() => setLocation(tool.link)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  Accéder
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
