import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  tips: string[];
}

export default function RetirementGuide() {
  const [, setLocation] = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>('loi-pacte');

  const sections: GuideSection[] = [
    {
      id: 'loi-pacte',
      title: 'Loi PACTE',
      icon: <TrendingUp className="w-8 h-8" />,
      content: 'La Loi PACTE (Plan d\'Action pour la Croissance et la Transformation Économique) a introduit des changements majeurs dans les produits d\'épargne retraite. Elle permet notamment une meilleure flexibilité dans l\'utilisation de vos économies et facilite la transmission du patrimoine.',
      tips: [
        'Vous pouvez débloquer votre épargne PACTE pour l\'achat d\'une première résidence',
        'Les contrats PACTE offrent une meilleure transmission du patrimoine',
        'Les frais de gestion sont généralement plus avantageux',
        'Possibilité de sortie en rente ou en capital'
      ]
    },
    {
      id: 'age-legal',
      title: 'Âge Légal de Départ',
      icon: <Calendar className="w-8 h-8" />,
      content: 'L\'âge légal de départ à la retraite en France varie selon votre année de naissance. Depuis la réforme de 2023, l\'âge légal a été progressivement augmenté à 64 ans pour les personnes nées à partir de 1960.',
      tips: [
        'Vous pouvez partir à la retraite dès 62 ans avec une décote',
        'Travailler plus longtemps augmente votre pension',
        'La retraite anticipée est possible sous certaines conditions',
        'Consultez votre relevé de carrière régulièrement'
      ]
    },
    {
      id: 'rachat-trimestres',
      title: 'Rachat de Trimestres',
      icon: <DollarSign className="w-8 h-8" />,
      content: 'Le rachat de trimestres permet de compléter votre durée d\'assurance pour améliorer le calcul de votre pension de retraite. C\'est une option intéressante si vous avez des années incomplètes ou des périodes non cotisées.',
      tips: [
        'Vous pouvez racheter jusqu\'à 12 trimestres',
        'Le coût dépend de votre âge et de vos revenus',
        'Le rachat peut être déductible fiscalement',
        'Évaluez la rentabilité avant de racheter'
      ]
    },
    {
      id: 'epargne-retraite',
      title: 'Épargne Retraite',
      icon: <TrendingUp className="w-8 h-8" />,
      content: 'L\'épargne retraite complémentaire est essentielle pour maintenir votre niveau de vie. Plusieurs produits vous permettent de constituer progressivement votre capital : assurance-vie, PER, contrats collectifs, etc.',
      tips: [
        'Commencez à épargner dès que possible',
        'Diversifiez vos placements selon votre profil',
        'Profitez des avantages fiscaux disponibles',
        'Réévaluez votre stratégie régulièrement'
      ]
    }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Guide de la Retraite</h1>
            <p className="text-xl text-purple-100">Tout ce que vous devez savoir pour bien préparer votre retraite</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Préparez Votre Retraite Sereinement</h2>
              <p className="text-gray-600 text-lg">
                La retraite est une étape importante de la vie. Pour la préparer au mieux, il est essentiel de comprendre les différents mécanismes et options disponibles. Découvrez nos guides complets pour vous aider dans vos décisions.
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="text-purple-600">{section.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    </div>
                    <span className={`text-2xl text-purple-600 transition-transform ${expandedSection === section.id ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>

                  {expandedSection === section.id && (
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 mb-6 leading-relaxed">{section.content}</p>

                      <div className="bg-white rounded-lg p-6 border border-purple-200">
                        <h4 className="font-bold text-gray-900 mb-4">💡 Conseils Pratiques</h4>
                        <ul className="space-y-3">
                          {section.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                              <span className="text-purple-600 font-bold mt-1">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Besoin de Conseils Personnalisés ?</h2>
              <p className="text-purple-100 mb-8 text-lg">
                Nos conseillers experts sont à votre disposition pour vous aider à construire votre stratégie de retraite adaptée à votre situation.
              </p>
              <Button
                onClick={() => setLocation('/contact')}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-6 px-8 text-lg"
              >
                Prendre Rendez-vous
              </Button>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Questions Fréquentes</h2>

              <div className="space-y-4">
                {[
                  {
                    q: 'À quel âge puis-je prendre ma retraite ?',
                    a: 'L\'âge légal dépend de votre année de naissance. Pour les personnes nées à partir de 1960, c\'est 64 ans. Vous pouvez partir plus tôt avec une décote ou plus tard avec une surcote.'
                  },
                  {
                    q: 'Comment calculer ma pension de retraite ?',
                    a: 'Votre pension est calculée en fonction de votre durée d\'assurance, de vos revenus et de votre âge de départ. Consultez votre relevé de carrière auprès de la Sécurité Sociale.'
                  },
                  {
                    q: 'Quels sont les avantages de l\'épargne retraite ?',
                    a: 'L\'épargne retraite offre des avantages fiscaux, une croissance du capital à long terme et une meilleure sécurité financière à la retraite.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
                    <p className="text-gray-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
