import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrencyConverter from './CurrencyConverter';
import LoanCalculator from './LoanCalculator';
import { DollarSign, Home } from 'lucide-react';

export default function InteractiveFinancialTools() {
  const [activeTab, setActiveTab] = useState<string>('converter');

  return (
    <section id="outils" className="bg-gradient-to-b from-purple-50 to-white py-16 md:py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold text-sm md:text-base mb-2">Outils Financiers Interactifs</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Calculez et Convertissez
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Utilisez nos outils financiers pour planifier votre budget, convertir des devises et simuler vos emprunts immobiliers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="converter"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <DollarSign size={18} />
                <span className="hidden sm:inline">Convertisseur</span>
                <span className="sm:hidden">Devises</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calculator"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Calculateur</span>
                <span className="sm:hidden">Prêt</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="converter" className="animate-in fade-in-50 duration-300">
              <CurrencyConverter />
            </TabsContent>

            <TabsContent value="calculator" className="animate-in fade-in-50 duration-300">
              <LoanCalculator />
            </TabsContent>
          </Tabs>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Taux Indicatifs</h3>
            <p className="text-sm text-gray-600">Taux de change de référence (BCE) pour estimer vos conversions</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-full mb-4">
              <Home className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Simulation Simple</h3>
            <p className="text-sm text-gray-600">Calculez vos mensualités et coûts totaux facilement</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Sans inscription</h3>
            <p className="text-sm text-gray-600">Aucune inscription requise pour utiliser ces outils</p>
          </div>
        </div>
      </div>
    </section>
  );
}
