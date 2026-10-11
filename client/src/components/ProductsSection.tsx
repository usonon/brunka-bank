import { Link } from 'wouter';
import { FeatureIllustration } from '@/components/Illustrations';

const features = [
  { label: "Comptes d'épargne", href: '/epargne' },
  { label: 'Services bancaires en ligne', href: '/ma-banque' },
  { label: 'Prêts', href: '/demander-pret' },
  { label: 'Placements', href: '/epargne' },
  { label: 'Cartes bancaires', href: '/card-comparator' },
  { label: 'Services de change', href: '#outils' },
];

export default function ProductsSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:justify-start">
            <FeatureIllustration className="max-w-sm w-full h-auto rounded-lg" />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-amber-500 font-semibold text-sm md:text-base mb-4">Commencer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
              Une offre complète de produits pour vos projets
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Comptes, épargne, prêts, cartes et change : retrouvez l'ensemble de nos services dans un espace unique, avec des conditions présentées de façon claire avant toute souscription.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f) => {
                const content = (
                  <>
                    <span className="flex items-center justify-center h-6 w-6 rounded-md bg-purple-600 text-white flex-shrink-0">✓</span>
                    <span className="ml-3 text-gray-700 font-medium group-hover:text-purple-600 transition-colors">{f.label}</span>
                  </>
                );
                return f.href.startsWith('#') ? (
                  <a key={f.label} href={f.href} className="group flex items-start">{content}</a>
                ) : (
                  <Link key={f.label} href={f.href} className="group flex items-start">{content}</Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
