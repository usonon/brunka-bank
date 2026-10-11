// Point unique de configuration de la marque.
// Modifiez ce fichier pour changer le nom, les coordonnées ou les mentions légales.
export const BRAND = {
  name: 'Brunka Bank',
  group: 'Brunka Groupe',
  email: 'contact@brunkagroupe.com',
  supportEmail: 'support@brunkagroupe.com',
  businessEmail: 'business@brunkagroupe.com',
  phones: ['+31 610 515 650', '+49 1521 4114288'],
  phoneHref: 'tel:+31610515650',
  address: '27 Division St, 1100 S Denver, CO 80237',
  hours: 'Lun-Ven : 9h-18h',
  // Affiche un bandeau « site de démonstration » tant que le site n'est pas relié
  // à un vrai back-end et que les informations légales ne sont pas renseignées.
  demoMode: true,
  // À compléter avant toute mise en ligne publique (mentions légales).
  legal: {
    companyName: '',
    legalForm: '',
    registrationNumber: '',
    shareCapital: '',
    registeredOffice: '',
    supervisoryAuthority: '',
    publicationDirector: '',
    hostName: '',
  },
} as const;
