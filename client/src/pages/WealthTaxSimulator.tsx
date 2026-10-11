import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { estimateIfi } from '@/lib/ifi';

export default function WealthTaxSimulator() {
  const [, setLocation] = useLocation();
  const [totalWealth, setTotalWealth] = useState(2000000);
  const [primaryResidence, setPrimaryResidence] = useState(500000);
  const [debts, setDebts] = useState(0);

  const primaryResidenceAbatement = Math.min(primaryResidence, totalWealth) * 0.3;
  // Barème et décote de l'IFI : voir lib/ifi.ts
  const { netTaxable: taxableBase, ifi, subject } = estimateIfi({
    totalRealEstate: totalWealth,
    primaryResidence,
    debts,
  });

  const monthlyIFI = ifi / 12;

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
              <TrendingUp className="w-12 h-12" />
              Simulateur d'Impôt sur la Fortune
            </h1>
            <p className="text-xl text-purple-100">Estimez votre IFI et optimisez votre patrimoine</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Simulator Form */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Vos Paramètres</h2>

                {/* Total Wealth */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Patrimoine immobilier total : <span className="text-purple-600">{totalWealth.toLocaleString('fr-FR')} €</span>
                  </label>
                  <input
                    type="range"
                    min="500000"
                    max="50000000"
                    step="100000"
                    value={totalWealth}
                    onChange={(e) => setTotalWealth(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>500 000 €</span>
                    <span>50 000 000 €</span>
                  </div>
                </div>

                {/* Primary Residence */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Valeur résidence principale : <span className="text-purple-600">{primaryResidence.toLocaleString('fr-FR')} €</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={totalWealth}
                    step="50000"
                    value={primaryResidence}
                    onChange={(e) => setPrimaryResidence(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-600 mt-2">Abattement appliqué : 30%</p>
                </div>

                {/* Debts */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Dettes immobilières : <span className="text-purple-600">{debts.toLocaleString('fr-FR')} €</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={totalWealth}
                    step="50000"
                    value={debts}
                    onChange={(e) => setDebts(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-600 mt-2">Les dettes réduisent votre base imposable</p>
                </div>

                <Button
                  onClick={() => setLocation('/contact')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg mt-8"
                >
                  Consulter un Expert
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {subject ? (
                  <>
                    <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-8">
                      <p className="text-red-100 mb-2">IFI Annuel Estimé</p>
                      <p className="text-5xl font-bold">
                        {ifi.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-red-100 text-sm mt-4">Vous êtes assujetti à l'IFI</p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                      <p className="text-sm text-gray-600 mb-2">IFI Mensuel</p>
                      <p className="text-3xl font-bold text-amber-600">
                        {monthlyIFI.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8">
                    <p className="text-green-100 mb-2">Statut IFI</p>
                    <p className="text-3xl font-bold">Exonéré</p>
                    <p className="text-green-100 text-sm mt-4">Votre patrimoine est en dessous du seuil d'imposition (1,3 million €)</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Patrimoine taxable</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {taxableBase.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-2">Abattement résidence</p>
                    <p className="text-2xl font-bold text-purple-600">
                      -{primaryResidenceAbatement.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Détail du Calcul</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patrimoine total</span>
                      <span className="font-semibold text-gray-900">{totalWealth.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Moins : Dettes</span>
                      <span className="font-semibold text-gray-900">-{debts.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Moins : Abattement résidence</span>
                      <span className="font-semibold text-gray-900">-{primaryResidenceAbatement.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between">
                      <span className="text-gray-600">Base imposable</span>
                      <span className="font-bold text-purple-600">{taxableBase.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Conseil :</strong> Cette simulation est indicative. Pour optimiser votre situation fiscale, consultez un expert en fiscalité immobilière.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
