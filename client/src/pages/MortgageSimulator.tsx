import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function MortgageSimulator() {
  const [, setLocation] = useLocation();
  const [amount, setAmount] = useState(300000);
  const [rate, setRate] = useState(3.5);
  const [duration, setDuration] = useState(20);

  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = duration * 12;
  const monthlyPayment =
    (amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalCost = monthlyPayment * numberOfPayments;
  const totalInterest = totalCost - amount;

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
              Simulateur de Crédit Immobilier
            </h1>
            <p className="text-xl text-purple-100">Calculez votre mensualité et planifiez votre projet immobilier</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Simulator Form */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Paramètres du Prêt</h2>

                {/* Montant */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Montant du prêt : <span className="text-purple-600">{amount.toLocaleString('fr-FR')} €</span>
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>50 000 €</span>
                    <span>1 000 000 €</span>
                  </div>
                </div>

                {/* Taux */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Taux d'intérêt annuel : <span className="text-purple-600">{rate.toFixed(2)} %</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>0.5 %</span>
                    <span>8 %</span>
                  </div>
                </div>

                {/* Durée */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Durée du prêt : <span className="text-purple-600">{duration} ans</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>5 ans</span>
                    <span>40 ans</span>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation('/signup')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg mt-8"
                >
                  Demander un Prêt
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-8">
                  <p className="text-purple-100 mb-2">Mensualité estimée</p>
                  <p className="text-5xl font-bold">{monthlyPayment.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                  <p className="text-purple-100 text-sm mt-4">Hors assurance et frais de dossier</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Coût total du prêt</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <p className="text-sm text-gray-600 mb-2">Intérêts totaux</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalInterest.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Résumé</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant emprunté</span>
                      <span className="font-semibold text-gray-900">{amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux annuel</span>
                      <span className="font-semibold text-gray-900">{rate.toFixed(2)} %</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-semibold text-gray-900">{duration} ans ({numberOfPayments} mois)</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between">
                      <span className="text-gray-600">Mensualité</span>
                      <span className="font-bold text-purple-600">{monthlyPayment.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Conseil :</strong> Cette simulation est indicative. Pour une offre précise, contactez nos conseillers qui pourront vous proposer des conditions adaptées à votre situation.
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
