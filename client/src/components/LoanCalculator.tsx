import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);

  // Calculer les mensualités
  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return (principal / numberOfPayments).toFixed(2);
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment.toFixed(2);
  };

  // Calculer le coût total
  const calculateTotalCost = () => {
    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    const totalPayment = monthlyPayment * loanTerm * 12;
    return totalPayment.toFixed(2);
  };

  // Calculer les intérêts totaux
  const calculateTotalInterest = () => {
    const totalCost = parseFloat(calculateTotalCost());
    const totalInterest = totalCost - loanAmount;
    return totalInterest.toFixed(2);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalCost = calculateTotalCost();
  const totalInterest = calculateTotalInterest();

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-purple-600 mb-6">Simulateur de Crédit Immobilier</h3>

      <div className="space-y-8">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold text-gray-700">Montant du Prêt</label>
            <span className="text-lg font-bold text-purple-600">{loanAmount.toLocaleString('fr-FR')} €</span>
          </div>
          <Slider
            value={[loanAmount]}
            onValueChange={(value) => setLoanAmount(value[0])}
            min={50000}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>50 000 €</span>
            <span>1 000 000 €</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold text-gray-700">Taux d'Intérêt Annuel</label>
            <span className="text-lg font-bold text-purple-600">{interestRate.toFixed(2)} %</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={0.5}
            max={8}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0.5 %</span>
            <span>8 %</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold text-gray-700">Durée du Prêt</label>
            <span className="text-lg font-bold text-purple-600">{loanTerm} ans</span>
          </div>
          <Slider
            value={[loanTerm]}
            onValueChange={(value) => setLoanTerm(value[0])}
            min={5}
            max={40}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>5 ans</span>
            <span>40 ans</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">Mensualité</p>
            <p className="text-2xl font-bold text-purple-600">{parseFloat(monthlyPayment).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">Coût Total</p>
            <p className="text-2xl font-bold text-cyan-600">{parseFloat(totalCost).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">Intérêts Totaux</p>
            <p className="text-2xl font-bold text-amber-600">{parseFloat(totalInterest).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Résumé :</span> Vous empruntez <span className="font-bold text-purple-600">{loanAmount.toLocaleString('fr-FR')} €</span> à <span className="font-bold text-purple-600">{interestRate.toFixed(2)} %</span> sur <span className="font-bold text-purple-600">{loanTerm} ans</span>.
          </p>
          <p className="text-sm text-gray-700">
            Votre mensualité sera de <span className="font-bold text-purple-600">{parseFloat(monthlyPayment).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span> (hors assurance et frais).
          </p>
        </div>
      </div>
    </div>
  );
}
