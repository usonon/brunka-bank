import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function RetirementSimulator() {
  const [, setLocation] = useLocation();
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [returnRate, setReturnRate] = useState(4);

  const yearsToRetirement = retirementAge - currentAge;
  const months = yearsToRetirement * 12;
  const monthlyRate = returnRate / 100 / 12;

  // Calculate future value with monthly contributions
  const futureValueContributions =
    monthlyContribution *
    (Math.pow(1 + monthlyRate, months) - 1) /
    monthlyRate;

  // Calculate future value of current savings
  const futureValueSavings = currentSavings * Math.pow(1 + monthlyRate, months);

  const totalRetirementSavings = futureValueContributions + futureValueSavings;

  // Estimate monthly pension (4% rule)
  const estimatedMonthlyPension = totalRetirementSavings / (12 * (85 - retirementAge));

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
              Simulateur de Retraite
            </h1>
            <p className="text-xl text-purple-100">Estimez votre pension de retraite et planifiez votre épargne</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Simulator Form */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Vos Paramètres</h2>

                {/* Current Age */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Âge actuel : <span className="text-purple-600">{currentAge} ans</span>
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    step="1"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Retirement Age */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Âge de retraite souhaité : <span className="text-purple-600">{retirementAge} ans</span>
                  </label>
                  <input
                    type="range"
                    min={currentAge + 5}
                    max="75"
                    step="1"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Current Savings */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Épargne actuelle : <span className="text-purple-600">{currentSavings.toLocaleString('fr-FR')} €</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Monthly Contribution */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Épargne mensuelle : <span className="text-purple-600">{monthlyContribution.toLocaleString('fr-FR')} €</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Return Rate */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Rendement annuel estimé : <span className="text-purple-600">{returnRate.toFixed(1)} %</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-600 mt-2">Rendement moyen historique : 4-5% par an</p>
                </div>

                <Button
                  onClick={() => setLocation('/contact')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg mt-8"
                >
                  Consulter un Conseiller
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-8">
                  <p className="text-purple-100 mb-2">Capital à la retraite</p>
                  <p className="text-5xl font-bold">
                    {totalRetirementSavings.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-purple-100 text-sm mt-4">À {retirementAge} ans</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Pension mensuelle estimée</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {estimatedMonthlyPension.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Basée sur une durée de vie jusqu'à 85 ans</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Années d'épargne</p>
                    <p className="text-2xl font-bold text-green-600">{yearsToRetirement} ans</p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <p className="text-sm text-gray-600 mb-2">Total versé</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {(currentSavings + monthlyContribution * months).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Gains d'Investissement</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {(totalRetirementSavings - currentSavings - monthlyContribution * months).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Grâce aux intérêts composés</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Note :</strong> Cette simulation est basée sur des hypothèses. Les rendements réels peuvent varier. Consultez un conseiller pour un plan personnalisé.
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
