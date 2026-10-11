import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  description: string;
  annualFee: string;
  cashback: string;
  features: string[];
  color: string;
}

export default function CardComparator() {
  const [, setLocation] = useLocation();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const cards: Card[] = [
    {
      id: 'essentielle',
      name: 'Carte Essentielle',
      description: 'La carte des paiements du quotidien',
      annualFee: 'Gratuit',
      cashback: '0.5%',
      features: ['Paiements sans contact', 'Assurance voyage', 'Assistance en cas de perte'],
      color: 'from-purple-600 to-purple-700'
    },
    {
      id: 'premium',
      name: 'Carte Premium',
      description: 'La carte pour voyager et consommer davantage',
      annualFee: '99€/an',
      cashback: '1.5%',
      features: ['Cashback élevé', 'Assurance complète', 'Assurance annulation', 'Service d\'assistance'],
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'business',
      name: 'Carte Business',
      description: 'La carte pour les professionnels',
      annualFee: '149€/an',
      cashback: '2%',
      features: ['Gestion comptable', 'Limite élevée', 'Rapports détaillés', 'Support dédié', 'Avantages business'],
      color: 'from-amber-600 to-amber-700'
    },
    {
      id: 'student',
      name: 'Carte Étudiant',
      description: 'La carte pour les étudiants',
      annualFee: 'Gratuit',
      cashback: '1%',
      features: ['Réductions étudiantes', 'Paiements flexibles', 'Limite adaptée', 'Support dédié aux étudiants'],
      color: 'from-green-600 to-green-700'
    }
  ];

  const toggleCard = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Comparateur de Cartes</h1>
            <p className="text-xl text-purple-100">Trouvez la carte bancaire qui vous correspond</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Cartes Bancaires</h2>
              <p className="text-gray-600 text-lg">Comparez les caractéristiques de chaque carte pour trouver celle qui vous convient le mieux.</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl p-6 text-white cursor-pointer transition-transform hover:scale-105 bg-gradient-to-br ${card.color}`}
                  onClick={() => toggleCard(card.id)}
                >
                  <h3 className="text-2xl font-bold mb-2">{card.name}</h3>
                  <p className="text-purple-100 mb-4 text-sm">{card.description}</p>

                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-100">Frais annuels</p>
                    <p className="text-2xl font-bold">{card.annualFee}</p>
                  </div>

                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-100">Cashback</p>
                    <p className="text-2xl font-bold">{card.cashback}</p>
                  </div>

                  <Button
                    className={`w-full ${selectedCards.includes(card.id) ? 'bg-white text-purple-600' : 'bg-purple-500 hover:bg-purple-600'} text-white font-semibold`}
                  >
                    {selectedCards.includes(card.id) ? '✓ Sélectionnée' : 'Comparer'}
                  </Button>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            {selectedCards.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Comparaison Détaillée</h2>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Caractéristiques</th>
                          {cards
                            .filter(c => selectedCards.includes(c.id))
                            .map(card => (
                              <th key={card.id} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                {card.name}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Frais annuels</td>
                          {cards
                            .filter(c => selectedCards.includes(c.id))
                            .map(card => (
                              <td key={card.id} className="px-6 py-4 text-gray-600">
                                {card.annualFee}
                              </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Cashback</td>
                          {cards
                            .filter(c => selectedCards.includes(c.id))
                            .map(card => (
                              <td key={card.id} className="px-6 py-4 text-gray-600">
                                {card.cashback}
                              </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Avantages</td>
                          {cards
                            .filter(c => selectedCards.includes(c.id))
                            .map(card => (
                              <td key={card.id} className="px-6 py-4">
                                <ul className="space-y-2">
                                  {card.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                                      <Check className="w-4 h-4 text-green-600" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                  <Button
                    onClick={() => setSelectedCards([])}
                    variant="outline"
                    className="font-semibold"
                  >
                    Effacer la sélection
                  </Button>
                  <Button
                    onClick={() => setLocation('/signup')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    Demander une carte
                  </Button>
                </div>
              </div>
            )}

            {selectedCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Cliquez sur une carte pour la comparer</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
