import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, DollarSign } from 'lucide-react';
import { estimateIfi } from '@/lib/ifi';

interface IFIInfo {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export default function IFIGuide() {
  const [, setLocation] = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>('what-is-ifi');
  const [totalRealEstate, setTotalRealEstate] = useState('');
  const [primaryResidence, setPrimaryResidence] = useState('');
  const [estimate, setEstimate] = useState<ReturnType<typeof estimateIfi> | null>(null);

  const computeEstimate = () => {
    setEstimate(
      estimateIfi({
        totalRealEstate: parseFloat(totalRealEstate) || 0,
        primaryResidence: parseFloat(primaryResidence) || 0,
      })
    );
  };


  const ifiInfo: IFIInfo[] = [
    {
      id: 'what-is-ifi',
      title: 'Qu\'est-ce que l\'IFI ?',
      description: 'L\'Impôt sur la Fortune Immobilière est un impôt annuel sur le patrimoine immobilier.',
      details: [
        'L\'IFI remplace l\'ISF depuis 2018',
        'Il s\'applique uniquement aux biens immobiliers',
        'Les valeurs mobilières et les placements financiers sont exonérés',
        'C\'est un impôt progressif basé sur la valeur du patrimoine'
      ]
    },
    {
      id: 'who-pays',
      title: 'Qui doit payer l\'IFI ?',
      description: 'L\'IFI s\'applique à certaines personnes selon des critères spécifiques.',
      details: [
        'Les résidents français avec un patrimoine immobilier > 1,3 million €',
        'Les résidents étrangers possédant des biens immobiliers en France',
        'Les couples mariés ou pacsés déclarent ensemble',
        'Les enfants mineurs sont inclus dans le patrimoine parental'
      ]
    },
    {
      id: 'what-included',
      title: 'Qu\'est-ce qui est inclus dans l\'IFI ?',
      description: 'Certains biens immobiliers sont soumis à l\'IFI.',
      details: [
        'Votre résidence principale (avec abattement de 30%)',
        'Vos résidences secondaires',
        'Les terrains et terres agricoles',
        'Les biens immobiliers loués',
        'Les parts de sociétés immobilières'
      ]
    },
    {
      id: 'exemptions',
      title: 'Exonérations et Abattements',
      description: 'Plusieurs mécanismes permettent de réduire votre IFI.',
      details: [
        'Abattement de 30% sur la résidence principale',
        'Exonération pour les biens professionnels (sous conditions)',
        'Exonération pour les terres agricoles exploitées',
        'Abattement pour les enfants à charge',
        'Possibilité de donation pour réduire le patrimoine'
      ]
    },
    {
      id: 'tax-rates',
      title: 'Barème de l\'IFI',
      description: 'L\'IFI est calculé selon un barème progressif.',
      details: [
        'Jusqu\'à 800 000 € : 0,5%',
        'De 800 000 € à 1,2 million € : 0,7%',
        'De 1,2 à 2,4 millions € : 1%',
        'De 2,4 à 10 millions € : 1,25%',
        'Au-delà de 10 millions € : 1,5%'
      ]
    },
    {
      id: 'optimization',
      title: 'Stratégies d\'Optimisation',
      description: 'Plusieurs stratégies peuvent aider à réduire votre IFI.',
      details: [
        'Donation progressive à vos enfants',
        'Investissement dans des biens professionnels exonérés',
        'Mise en place d\'une SCI pour optimiser la transmission',
        'Consultation d\'un expert en fiscalité immobilière',
        'Planification successorale anticipée'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
              <Home className="w-12 h-12" />
              Guide de l'IFI
            </h1>
            <p className="text-xl text-purple-100">Comprendre et optimiser votre Impôt sur la Fortune Immobilière</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tout Savoir sur l'IFI</h2>
              <p className="text-gray-600 text-lg">
                L'Impôt sur la Fortune Immobilière est un élément important de votre planification fiscale. Découvrez comment il fonctionne et comment l'optimiser.
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4 mb-12">
              {ifiInfo.map((section) => (
                <div
                  key={section.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                    className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    </div>
                    <span className={`text-2xl text-purple-600 transition-transform ${expandedId === section.id ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>

                  {expandedId === section.id && (
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 mb-6 leading-relaxed">{section.description}</p>

                      <div className="bg-white rounded-lg p-6 border border-purple-200">
                        <ul className="space-y-3">
                          {section.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                              <span className="text-purple-600 font-bold mt-1">✓</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calculator Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estimateur Rapide d'IFI</h2>
              <p className="text-gray-600 mb-6">
                Utilisez cet estimateur pour avoir une première idée de votre IFI. Pour une évaluation précise, consultez un expert.
              </p>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Valeur de votre patrimoine immobilier
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={totalRealEstate}
                      onChange={(e) => setTotalRealEstate(e.target.value)}
                      placeholder="Montant en euros"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Valeur de votre résidence principale
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={primaryResidence}
                      onChange={(e) => setPrimaryResidence(e.target.value)}
                      placeholder="Montant en euros"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <Button onClick={computeEstimate} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
                    Calculer mon IFI Estimé
                  </Button>

                  {estimate && (
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-4 text-gray-800" role="status">
                      <p className="text-sm text-gray-600">Patrimoine net taxable (après abattement de 30 % sur la résidence principale)</p>
                      <p className="font-bold text-lg">{estimate.netTaxable.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</p>
                      {estimate.subject ? (
                        <p className="mt-2">
                          IFI estimé : <span className="font-bold text-purple-600">{estimate.ifi.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                        </p>
                      ) : (
                        <p className="mt-2">Votre patrimoine net taxable est inférieur au seuil de 1 300 000 € : vous n'êtes pas redevable de l'IFI selon cette estimation.</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">Estimation indicative, hors dettes et cas particuliers. Ce résultat ne constitue pas un conseil fiscal.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Optimisez Votre Fiscalité</h2>
              <p className="text-purple-100 mb-8 text-lg">
                Nos experts en fiscalité immobilière peuvent vous aider à mettre en place une stratégie adaptée à votre situation.
              </p>
              <Button
                onClick={() => setLocation('/contact')}
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-6 px-8 text-lg"
              >
                Consulter un Expert
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
