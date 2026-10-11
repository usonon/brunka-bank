import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, TrendingUp, Lock } from 'lucide-react';

export default function Credits() {
  const [, setLocation] = useLocation();

  const creditProducts = [
    {
      title: 'Carte de Crédit Premium',
      description: 'Accès aux avantages exclusifs et aux récompenses de voyage.',
      icon: CreditCard,
      benefits: ['Cashback 2%', 'Assurance voyage', 'Accès lounge aéroport'],
      fee: '49€/an'
    },
    {
      title: 'Carte Crédit Standard',
      description: 'La carte idéale pour vos achats du quotidien.',
      icon: CreditCard,
      benefits: ['Frais annuels : voir conditions', 'Paiements flexibles', 'Protection achat'],
      fee: 'Gratuite'
    },
    {
      title: 'Crédit Renouvelable',
      description: 'Accédez à un crédit disponible quand vous en avez besoin.',
      icon: Zap,
      benefits: ['Montant flexible', 'Réserve disponible', 'Taux indiqué à l\'avance'],
      fee: 'À partir de 5.2%'
    },
    {
      title: 'Découvert Autorisé',
      description: 'Une petite facilité de trésorerie pour les imprévus.',
      icon: Lock,
      benefits: ['Jusqu\'à 500€', 'Conditions indiquées à l\'avance', 'Accès immédiat'],
      fee: 'À partir de 7%'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Crédits</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Accédez au crédit dont vous avez besoin avec des conditions transparentes et flexibles.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Nos Solutions de Crédit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {creditProducts.map((product, index) => {
                const Icon = product.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Icon className="w-8 h-8 text-green-600" />
                      </div>
                      <span className="text-lg font-bold text-green-600">{product.fee}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-600 mb-3">Avantages :</p>
                      <ul className="space-y-2">
                        {product.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setLocation(`/contact?sujet=loan&message=${encodeURIComponent('Bonjour, je souhaite en savoir plus sur : ' + product.title)}`)}
                    >
                      En savoir plus
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Avantages de nos Crédits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: '⚡', title: 'Demande en ligne', desc: 'Dossier à compléter depuis chez vous' },
                { icon: '💰', title: 'Taux indiqués', desc: 'Présentés avant tout engagement' },
                { icon: '📱', title: 'Suivi en ligne', desc: 'Depuis votre espace client' },
                { icon: '🔒', title: 'Sécurisé', desc: 'Connexion protégée' },
                { icon: '✓', title: 'Transparent', desc: 'Conditions détaillées à l\'avance' },
                { icon: '🎯', title: 'Flexible', desc: 'Durées adaptables' },
                { icon: '📞', title: 'Support', desc: 'Équipe joignable en semaine' },
                { icon: '🚀', title: 'Étapes claires', desc: 'Simulation, demande, étude' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Comparaison des Crédits
            </h2>

            <div className="overflow-x-auto max-w-5xl mx-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="border border-gray-300 p-4 text-left">Type de Crédit</th>
                    <th className="border border-gray-300 p-4 text-center">Montant</th>
                    <th className="border border-gray-300 p-4 text-center">Durée</th>
                    <th className="border border-gray-300 p-4 text-center">Taux</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Carte Crédit', amount: 'Jusqu\'à 50k€', duration: 'Variable', rate: '5-15%' },
                    { type: 'Crédit Renouvelable', amount: 'Jusqu\'à 75k€', duration: '1-10 ans', rate: '5.2-8%' },
                    { type: 'Découvert', amount: 'Jusqu\'à 500€', duration: 'Variable', rate: '7-12%' },
                    { type: 'Crédit Immobilier', amount: 'Jusqu\'à 1M€', duration: '5-40 ans', rate: '3.2-4.5%' }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 p-4 font-semibold text-gray-900">{row.type}</td>
                      <td className="border border-gray-300 p-4 text-center text-gray-700">{row.amount}</td>
                      <td className="border border-gray-300 p-4 text-center text-gray-700">{row.duration}</td>
                      <td className="border border-gray-300 p-4 text-center font-bold text-green-600">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Trouvez le Crédit Idéal</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Comparez nos offres et trouvez le crédit qui correspond à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => setLocation('/demander-pret')}>
                Demander un Crédit
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-green-700 px-8 py-6 text-lg"
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
