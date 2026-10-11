import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BRAND } from '@/lib/brand';

const faqs = [
  {
    q: 'Comment devenir client ?',
    a: "Rendez-vous sur la page « Devenir Client », renseignez vos informations et créez votre mot de passe. Vous accédez ensuite à votre espace client.",
  },
  {
    q: 'Comment me connecter à mon espace client ?',
    a: "Utilisez la page « Se Connecter » avec l'e-mail et le mot de passe choisis lors de votre inscription.",
  },
  {
    q: "J'ai oublié mon mot de passe, que faire ?",
    a: `Écrivez-nous à ${BRAND.supportEmail} en indiquant l'e-mail de votre compte. Nous vous indiquerons la marche à suivre.`,
  },
  {
    q: 'Comment estimer les mensualités d\'un prêt ?',
    a: "Utilisez le simulateur de crédit depuis la page « Demander un prêt » : choisissez le type de prêt, le montant, le taux et la durée.",
  },
  {
    q: 'Où trouver les conditions de mes produits ?',
    a: "Les conditions sont indiquées sur la page de chaque produit (épargne, crédits, assurance, cartes) et détaillées avant toute souscription.",
  },
  {
    q: 'Comment contacter le service client ?',
    a: `Par e-mail à ${BRAND.email}, par téléphone au ${BRAND.phones[0]} (${BRAND.hours}) ou via le formulaire de la page Contact.`,
  },
];

export default function Help() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Aide</h1>
            <p className="text-xl text-purple-100">Les réponses aux questions les plus fréquentes</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center bg-purple-50 border border-purple-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vous ne trouvez pas votre réponse ?</h2>
              <p className="text-gray-600 mb-6">Notre équipe est là pour vous aider.</p>
              <Button onClick={() => setLocation('/contact')} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6">
                Nous contacter
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
