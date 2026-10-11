import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import { Shield, Heart, Home, Briefcase } from 'lucide-react';

export default function Insurance() {
  const [, setLocation] = useLocation();

  const insuranceProducts = [
    {
      title: 'Assurance Habitation',
      description: 'Protégez votre maison et vos biens contre les sinistres.',
      icon: Home,
      coverage: 'Incendie, vol, dégâts des eaux',
      price: 'À partir de 8€/mois'
    },
    {
      title: 'Assurance Auto',
      description: 'Couverture complète pour votre véhicule et votre responsabilité civile.',
      icon: Briefcase,
      coverage: 'Tiers, tiers+, tous risques',
      price: 'À partir de 25€/mois'
    },
    {
      title: 'Assurance Santé',
      description: 'Remboursement des frais médicaux et dentaires.',
      icon: Heart,
      coverage: 'Médecin, dentiste, pharmacie',
      price: 'À partir de 15€/mois'
    },
    {
      title: 'Assurance Emprunteur',
      description: 'Protégez votre crédit immobilier en cas de sinistre.',
      icon: Shield,
      coverage: 'Décès, invalidité, incapacité',
      price: 'À partir de 0.3%/an'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Assurance</h1>
            <p className="text-xl text-red-100 max-w-2xl">
              Protégez-vous et votre famille avec nos solutions d'assurance complètes et abordables.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Nos Produits d'Assurance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {insuranceProducts.map((product, index) => {
                const Icon = product.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Icon className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                    </div>

                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Couverture :</p>
                        <p className="font-semibold text-gray-900">{product.coverage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tarif :</p>
                        <p className="font-semibold text-red-600 text-lg">{product.price}</p>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => setLocation(`/contact?sujet=insurance&message=${encodeURIComponent('Bonjour, je souhaite en savoir plus sur : ' + product.title)}`)}
                    >
                      Découvrir l'offre
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Brunka Bank Insurance */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-red-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi l'assurance {BRAND.name} ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: 'Tarifs Lisibles',
                  description: 'Des tarifs présentés clairement, avec le détail des garanties'
                },
                {
                  title: 'Souscription en ligne',
                  description: 'Demandez votre devis directement en ligne'
                },
                {
                  title: 'Gestion Simplifiée',
                  description: 'Gérez votre assurance facilement via notre application'
                },
                {
                  title: 'Support Réactif',
                  description: 'Une équipe à votre écoute pour répondre à vos questions'
                },
                {
                  title: 'Suivi des sinistres',
                  description: 'Un accompagnement pour déclarer et suivre vos sinistres'
                },
                {
                  title: 'Garanties Flexibles',
                  description: 'Adaptez votre couverture à vos besoins réels'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Protégez-vous Dès Aujourd'hui</h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Demandez un devis et comparez les garanties proposées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg" onClick={() => setLocation('/contact?sujet=insurance&message=' + encodeURIComponent('Bonjour, je souhaite obtenir un devis d\'assurance.'))}>
                Obtenir un Devis
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-red-700 px-8 py-6 text-lg"
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
