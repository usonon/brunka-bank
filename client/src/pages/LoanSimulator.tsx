import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft } from 'lucide-react';

interface LoanType {
  type: 'immobilier' | 'auto' | 'etudiant' | 'conso';
  title: string;
  minAmount: number;
  maxAmount: number;
  minRate: number;
  maxRate: number;
  minDuration: number;
  maxDuration: number;
  defaultRate: number;
}

const loanTypes: Record<string, LoanType> = {
  immobilier: {
    type: 'immobilier',
    title: 'Crédit Immobilier',
    minAmount: 50000,
    maxAmount: 1000000,
    minRate: 2.0,
    maxRate: 6.0,
    minDuration: 5,
    maxDuration: 40,
    defaultRate: 3.2
  },
  auto: {
    type: 'auto',
    title: 'Crédit Auto',
    minAmount: 5000,
    maxAmount: 100000,
    minRate: 2.5,
    maxRate: 7.0,
    minDuration: 1,
    maxDuration: 10,
    defaultRate: 4.5
  },
  etudiant: {
    type: 'etudiant',
    title: 'Crédit Étudiant',
    minAmount: 1000,
    maxAmount: 50000,
    minRate: 1.5,
    maxRate: 5.0,
    minDuration: 2,
    maxDuration: 15,
    defaultRate: 2.8
  },
  conso: {
    type: 'conso',
    title: 'Crédit Conso',
    minAmount: 1000,
    maxAmount: 75000,
    minRate: 3.0,
    maxRate: 8.0,
    minDuration: 1,
    maxDuration: 10,
    defaultRate: 5.2
  }
};

export default function LoanSimulator() {
  const [, setLocation] = useLocation();
  const loanType = new URLSearchParams(window.location.search).get('type') || 'immobilier';
  const loan = loanTypes[loanType] || loanTypes.immobilier;

  const [amount, setAmount] = useState(loan.minAmount + (loan.maxAmount - loan.minAmount) / 2);
  const [rate, setRate] = useState(loan.defaultRate);
  const [duration, setDuration] = useState(15);

  // Calcul de la mensualité
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = duration * 12;
  const monthlyPayment = monthlyRate === 0 
    ? amount / numberOfPayments
    : (amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalCost = monthlyPayment * numberOfPayments;
  const totalInterest = totalCost - amount;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => setLocation('/demander-pret')}
              className="flex items-center gap-2 text-amber-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{loan.title}</h1>
            <p className="text-xl text-amber-100">Simulez votre prêt et découvrez vos mensualités</p>
          </div>
        </section>

        {/* Simulator Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Controls */}
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Montant du prêt : <span className="text-amber-600 font-bold text-lg">{amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </label>
                  <Slider
                    value={[amount]}
                    onValueChange={(value) => setAmount(value[0])}
                    min={loan.minAmount}
                    max={loan.maxAmount}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{(loan.minAmount / 1000).toFixed(0)}k€</span>
                    <span>{(loan.maxAmount / 1000).toFixed(0)}k€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Taux d'intérêt : <span className="text-amber-600 font-bold text-lg">{rate.toFixed(2)}%</span>
                  </label>
                  <Slider
                    value={[rate]}
                    onValueChange={(value) => setRate(value[0])}
                    min={loan.minRate}
                    max={loan.maxRate}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{loan.minRate.toFixed(1)}%</span>
                    <span>{loan.maxRate.toFixed(1)}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Durée du prêt : <span className="text-amber-600 font-bold text-lg">{duration} ans</span>
                  </label>
                  <Slider
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    min={loan.minDuration}
                    max={loan.maxDuration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{loan.minDuration} ans</span>
                    <span>{loan.maxDuration} ans</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Résultats de votre simulation</h2>

                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border border-amber-100">
                      <p className="text-gray-600 text-sm mb-2">Mensualité estimée</p>
                      <p className="text-4xl font-bold text-amber-600">
                        {monthlyPayment.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-6 border border-amber-100">
                        <p className="text-gray-600 text-sm mb-2">Coût total du prêt</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-amber-100">
                        <p className="text-gray-600 text-sm mb-2">Intérêts totaux</p>
                        <p className="text-2xl font-bold text-red-600">
                          {totalInterest.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <p className="text-gray-600 text-sm mb-2">Nombre de mensualités</p>
                      <p className="text-2xl font-bold text-blue-600">{numberOfPayments} mois</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-6 text-lg"
                  onClick={() =>
                    setLocation(
                      `/contact?sujet=loan&message=${encodeURIComponent(
                        `Bonjour, je souhaite déposer une demande de ${loan.title.toLowerCase()} : ${amount.toLocaleString('fr-FR')} € sur ${duration} ans à ${rate}%.`
                      )}`
                    )
                  }
                >
                  Faire une demande officielle
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Comment fonctionne notre simulateur ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ajustez les paramètres</h3>
                <p className="text-gray-700">Modifiez le montant, le taux et la durée selon vos besoins</p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Consultez les résultats</h3>
                <p className="text-gray-700">Découvrez votre mensualité et le coût total du prêt</p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Faites une demande</h3>
                <p className="text-gray-700">Lancez votre demande officielle en quelques clics</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
