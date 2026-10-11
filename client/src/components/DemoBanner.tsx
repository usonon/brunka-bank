import { BRAND } from '@/lib/brand';

export default function DemoBanner() {
  if (!BRAND.demoMode) return null;
  return (
    <div className="bg-amber-100 text-amber-900 text-center text-xs sm:text-sm py-2 px-4">
      Site de démonstration : les parcours (inscription, connexion, virements, demandes) sont simulés et aucune opération réelle n'est effectuée.
    </div>
  );
}
