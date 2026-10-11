import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function MyBank() {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: 'Compte Courant',
      description: 'Gérez vos finances au quotidien avec un compte courant simple et transparent.',
      icon: '💳'
    },
    {
      title: 'Virements',
      description: 'Envoyez de l\'argent à vos bénéficiaires depuis votre espace client.',
      icon: '⚡'
    },
    {
      title: 'Paiements Mobiles',
      description: 'Payez avec votre carte et suivez vos paiements depuis votre espace client.',
      icon: '📱'
    },
    {
      title: 'Épargne Automatique',
      description: 'Économisez sans effort avec nos plans d\'épargne automatiques et personnalisés.',
      icon: '💰'
    },
    {
      title: 'Suivi des Transactions',
      description: 'Suivez vos transactions depuis votre espace client.',
      icon: '🔔'
    },
    {
      title: 'Support Client',
      description: 'Notre équipe est joignable en semaine pour répondre à vos questions.',
      icon: '🎧'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Ma Banque</h1>
            <p className="text-xl text-purple-100 max-w-2xl">
              Découvrez nos services bancaires complets conçus pour simplifier votre vie financière.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi choisir {BRAND.name} ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                'Conditions et tarifs présentés avant toute souscription',
                'Interface intuitive et facile à utiliser',
                'Connexion sécurisée à votre espace client',
                'Accès à votre espace client en ligne',
                'Informations tarifaires claires',
                'Demande d\'ouverture de compte en ligne'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à commencer ?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Faites votre demande d'ouverture de compte {BRAND.name} en ligne et suivez votre argent depuis votre espace client.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => setLocation('/signup')}>
                Ouvrir un Compte
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-purple-700 px-8 py-6 text-lg"
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
