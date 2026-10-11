import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, Car, GraduationCap, Zap } from 'lucide-react';

export default function LoanRequest() {
  const [, setLocation] = useLocation();

  const loanTypes = [
    {
      title: 'Crédit Immobilier',
      description: 'Financer l\'achat de votre maison ou appartement avec des conditions présentées avant tout engagement.',
      icon: Home,
      rate: 'À partir de 3.2%',
      amount: 'Jusqu\'à 1 000 000€',
      duration: '5 à 40 ans'
    },
    {
      title: 'Crédit Auto',
      description: 'Achetez la voiture de vos rêves avec un financement adapté à votre projet.',
      icon: Car,
      rate: 'À partir de 4.5%',
      amount: 'Jusqu\'à 100 000€',
      duration: '1 à 10 ans'
    },
    {
      title: 'Crédit Étudiant',
      description: 'Financez vos études avec un crédit adapté aux étudiants et jeunes diplômés.',
      icon: GraduationCap,
      rate: 'À partir de 2.8%',
      amount: 'Jusqu\'à 50 000€',
      duration: '2 à 15 ans'
    },
    {
      title: 'Crédit Conso',
      description: 'Réalisez vos projets avec notre crédit à la consommation.',
      icon: Zap,
      rate: 'À partir de 5.2%',
      amount: 'De 1 000 à 75 000€',
      duration: '1 à 10 ans'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Simulation',
      description: 'Utilisez notre simulateur pour estimer votre mensualité'
    },
    {
      number: '2',
      title: 'Demande',
      description: 'Complétez votre demande en ligne en quelques minutes'
    },
    {
      number: '3',
      title: 'Étude',
      description: 'Notre équipe étudie votre dossier'
    },
    {
      number: '4',
      title: 'Validation',
      description: 'Recevez une réponse et signez votre contrat'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-600 to-amber-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Demander un Prêt</h1>
            <p className="text-xl text-amber-100 max-w-2xl">
              Trouvez le financement qui correspond à vos besoins avec des taux indiqués à l'avance et un processus simplifié.
            </p>
          </div>
        </section>

        {/* Loan Types */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Nos Types de Prêts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loanTypes.map((loan, index) => {
                const Icon = loan.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <Icon className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{loan.title}</h3>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">{loan.description}</p>

                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taux :</span>
                        <span className="font-bold text-amber-600">{loan.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Montant :</span>
                        <span className="font-bold text-gray-900">{loan.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée :</span>
                        <span className="font-bold text-gray-900">{loan.duration}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={() => {
                        const typeMap: Record<string, string> = {
                          'Crédit Immobilier': 'immobilier',
                          'Crédit Auto': 'auto',
                          'Crédit Étudiant': 'etudiant',
                          'Crédit Conso': 'conso'
                        };
                        setLocation(`/loan-simulator?type=${typeMap[loan.title] || 'immobilier'}`);
                      }}
                    >
                      Simuler ce prêt
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Notre Processus de Demande
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white border-2 border-amber-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-amber-600">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{step.title}</h3>
                  <p className="text-gray-700 text-center text-sm">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-1 bg-amber-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi nous choisir ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: 'Taux indiqués', desc: 'Présentés avant tout engagement, pour chaque type de prêt' },
                { title: 'Étude de votre dossier', desc: 'Notre équipe examine votre demande et revient vers vous' },
                { title: 'Processus Simple', desc: 'Simulation puis demande en ligne' },
                { title: 'Flexibilité', desc: 'Conditions de remboursement anticipé précisées dans l\'offre' },
                { title: 'Support Dédié', desc: 'Équipe d\'experts pour vous conseiller' },
                { title: 'Transparence', desc: 'Coûts et conditions détaillés avant signature' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">✓</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-amber-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Demander Votre Prêt ?</h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Commencez par une simulation, puis faites votre demande en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => setLocation('/loan-simulator')}>
                Faire une Demande
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-amber-700 px-8 py-6 text-lg"
                onClick={() => setLocation('/')}
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
