import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BRAND } from '@/lib/brand';

type Kind = 'mentions' | 'conditions' | 'confidentialite';

const TITLES: Record<Kind, string> = {
  mentions: 'Mentions légales',
  conditions: "Conditions d'utilisation",
  confidentialite: 'Politique de confidentialité',
};

const L = BRAND.legal;
const val = (v: string) => (v ? v : 'À renseigner');

export default function Legal({ kind }: { kind: Kind }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{TITLES[kind]}</h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-6 text-gray-700 leading-relaxed">
            {BRAND.demoMode && (
              <p className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                Ce site est en mode démonstration. Les informations ci-dessous doivent être complétées et validées (idéalement par un juriste) avant toute mise en ligne publique.
              </p>
            )}

            {kind === 'mentions' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Éditeur du site</h2>
                <ul className="space-y-1">
                  <li><strong>Marque :</strong> {BRAND.name}</li>
                  <li><strong>Raison sociale :</strong> {val(L.companyName || '')}</li>
                  <li><strong>Forme juridique :</strong> {val(L.legalForm)}</li>
                  <li><strong>Immatriculation :</strong> {val(L.registrationNumber)}</li>
                  <li><strong>Capital social :</strong> {val(L.shareCapital)}</li>
                  <li><strong>Siège social :</strong> {L.registeredOffice || BRAND.address}</li>
                  <li><strong>Autorité de contrôle / agrément :</strong> {val(L.supervisoryAuthority)}</li>
                  <li><strong>Directeur de la publication :</strong> {val(L.publicationDirector)}</li>
                  <li><strong>Contact :</strong> {BRAND.email}</li>
                </ul>
                <h2 className="text-2xl font-bold text-gray-900">Hébergeur</h2>
                <p>{val(L.hostName)}</p>
              </>
            )}

            {kind === 'conditions' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Objet</h2>
                <p>Les présentes conditions encadrent l'utilisation du site {BRAND.name} et de son espace client.</p>
                <h2 className="text-2xl font-bold text-gray-900">Compte et identifiants</h2>
                <p>Vous êtes responsable de la confidentialité de votre mot de passe et des opérations réalisées depuis votre espace. Informez-nous sans délai en cas d'utilisation non autorisée.</p>
                <h2 className="text-2xl font-bold text-gray-900">Simulateurs et informations</h2>
                <p>Les simulateurs, taux et exemples présentés sont indicatifs et ne constituent ni une offre contractuelle ni un conseil financier, fiscal ou juridique.</p>
                <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
                <p>Pour toute question : {BRAND.email}.</p>
              </>
            )}

            {kind === 'confidentialite' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Données collectées</h2>
                <p>Lors de votre inscription ou de vos demandes, nous pouvons traiter votre nom, votre adresse e-mail et votre numéro de téléphone afin de gérer votre espace client et de répondre à vos demandes.</p>
                <h2 className="text-2xl font-bold text-gray-900">Version de démonstration</h2>
                <p>Dans cette version, les données de compte sont conservées localement dans votre navigateur et ne sont pas transmises à un serveur.</p>
                <h2 className="text-2xl font-bold text-gray-900">Vos droits</h2>
                <p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à {BRAND.email}.</p>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
