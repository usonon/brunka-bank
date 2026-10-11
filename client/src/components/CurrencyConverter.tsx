import { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ExchangeRates {
  [key: string]: number;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<string>('0');
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState<boolean>(true);

  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD', 'CNY', 'INR'];

  // Taux indicatifs de repli, utilisés si le service de taux est indisponible.
  const fallbackRates: ExchangeRates = {
    EUR: 1,
    USD: 1.10,
    GBP: 0.86,
    JPY: 160.50,
    CHF: 0.95,
    CAD: 1.50,
    AUD: 1.68,
    NZD: 1.82,
    CNY: 7.95,
    INR: 91.50
  };

  const [rateInfo, setRateInfo] = useState<string>('Taux indicatifs (hors ligne)');

  useEffect(() => {
    let cancelled = false;
    const symbols = currencies.filter((c) => c !== 'EUR').join(',');
    // Taux de référence de la Banque centrale européenne, via frankfurter.app
    fetch(`https://api.frankfurter.app/latest?from=EUR&to=${symbols}`)
      .then((res) => {
        if (!res.ok) throw new Error('Service de taux indisponible');
        return res.json();
      })
      .then((data: { date?: string; rates?: ExchangeRates }) => {
        if (cancelled || !data.rates) return;
        setRates({ EUR: 1, ...data.rates });
        setRateInfo(`Taux de référence BCE du ${data.date ?? 'jour'} (indicatifs)`);
      })
      .catch(() => {
        if (cancelled) return;
        setRates(fallbackRates);
        setRateInfo('Taux indicatifs (hors ligne)');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const convertCurrency = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setResult('0');
      return;
    }

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    const amountInEur = parseFloat(amount) / fromRate;
    const converted = amountInEur * toRate;
    
    setResult(converted.toFixed(2));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency, rates]);

  if (loading) {
    return <div className="text-center py-8">Chargement des taux de change...</div>;
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-purple-600 mb-6">Convertisseur de Devises</h3>
      
      <div className="space-y-6">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">De</label>
          <div className="flex gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            onClick={swapCurrencies}
            aria-label="Inverser les devises"
            className="bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full p-3 transition-colors"
          >
            <ArrowRightLeft size={20} />
          </Button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vers</label>
          <div className="flex gap-3">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
            <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
              <span className="text-lg font-semibold text-gray-800">{result}</span>
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Taux :</span> 1 {fromCurrency} = {((rates[toCurrency] ?? 1) / (rates[fromCurrency] ?? 1)).toFixed(4)} {toCurrency}
            <span className="block text-xs text-gray-500 mt-1">{rateInfo}. Les taux appliqués lors d'une opération réelle peuvent différer.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
