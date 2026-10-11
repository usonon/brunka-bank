import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import { TrendingUp, PiggyBank, Target, Award } from 'lucide-react';

export default function Savings() {
  const [, setLocation] = useLocation();

  const savingsProducts = [
    {
      title: 'Compte Épargne Classique',
      description: 'Taux d\'intérêt indiqué avant souscription, avec accès à votre argent.',
      rate: '3.5%',
      icon: PiggyBank,
      features: ['Taux affiché avant souscription', 'Accès immédiat', 'Pas de frais']
    },
    {
      title: 'Épargne Retraite',
      description: 'Préparez votre retraite avec nos plans d\'épargne retraite optimisés.',
      rate: '4.2%',
      icon: Target,
      features: ['Avantages fiscaux', 'Gestion professionnelle', 'Suivi en ligne']
    },
    {
      title: 'Investissement Boursier',
      description: 'Diversifiez vos placements avec notre gamme de produits d\'investissement.',
      rate: 'Variable',
      icon: TrendingUp,
      features: ['Large choix de supports', 'Frais indiqués avant souscription', 'Suivi en ligne']
    },
    {
      title: 'Certificats de Dépôt',
      description: 'Placez votre argent à terme sur une durée définie à l\'avance.',
      rate: '4.8%',
      icon: Award,
      features: ['Rendement indiqué avant souscription', 'Durées au choix']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-600 to-cyan-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Épargne</h1>
            <p className="text-xl text-cyan-100 max-w-2xl">
              Faites fructifier votre argent avec nos solutions d'épargne et d'investissement adaptées à vos objectifs.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Nos Produits d'Épargne
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {savingsProducts.map((product, index) => {
                const Icon = product.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-10 h-10 text-cyan-600" />
                      <div className="text-3xl font-bold text-cyan-600">{product.rate}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                          <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      onClick={() => setLocation(`/contact?sujet=account&message=${encodeURIComponent('Bonjour, je souhaite en savoir plus sur : ' + product.title)}`)}
                    >
                      En savoir plus
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-cyan-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Avantages de l'épargne chez {BRAND.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rendements Clairs</h3>
                <p className="text-gray-700">
                  Nos taux sont indiqués avant toute souscription, pour que vous puissiez comparer.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurité</h3>
                <p className="text-gray-700">
                  Les conditions de protection de vos dépôts sont précisées dans la documentation de chaque produit.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gestion Simple</h3>
                <p className="text-gray-700">
                  Suivez vos placements facilement depuis votre espace client.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-cyan-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Commencez à Épargner Aujourd'hui</h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Chaque euro épargné est un euro pour votre futur. Ouvrez un compte d'épargne maintenant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => setLocation('/signup')}>
                Ouvrir un Compte Épargne
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-cyan-700 px-8 py-6 text-lg"
                onClick={() => setLocation('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
