// Illustrations vectorielles originales (remplacent les images externes manquantes).

export function PhoneIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 420" className={className} role="img" aria-label="Application mobile Brunka Bank">
      <defs>
        <linearGradient id="ph-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <rect x="60" y="10" width="200" height="400" rx="32" fill="#111827" />
      <rect x="70" y="24" width="180" height="372" rx="24" fill="#f9fafb" />
      <rect x="130" y="16" width="60" height="6" rx="3" fill="#374151" />
      <text x="86" y="62" fontSize="12" fill="#6b7280" fontFamily="Inter, sans-serif">Solde total</text>
      <text x="86" y="88" fontSize="24" fontWeight="700" fill="#111827" fontFamily="Poppins, Inter, sans-serif">12 480,00 €</text>
      <rect x="86" y="106" width="148" height="88" rx="14" fill="url(#ph-card)" />
      <rect x="98" y="122" width="28" height="20" rx="4" fill="#fbbf24" />
      <text x="98" y="170" fontSize="11" fill="#ede9fe" fontFamily="Inter, sans-serif">•••• •••• •••• 4821</text>
      <text x="98" y="184" fontSize="9" fill="#c4b5fd" fontFamily="Inter, sans-serif">BRUNKA BANK</text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(86 ${212 + i * 46})`}>
          <circle cx="16" cy="16" r="16" fill={['#ede9fe', '#cffafe', '#fef3c7'][i]} />
          <rect x="42" y="6" width="70" height="8" rx="4" fill="#d1d5db" />
          <rect x="42" y="20" width="44" height="7" rx="3.5" fill="#e5e7eb" />
          <rect x="112" y="10" width="36" height="9" rx="4.5" fill={['#a78bfa', '#67e8f9', '#fcd34d'][i]} />
        </g>
      ))}
    </svg>
  );
}

export function FeatureIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Illustration des services bancaires">
      <rect width="400" height="320" rx="24" fill="#ede9fe" />
      <circle cx="320" cy="60" r="60" fill="#ddd6fe" />
      <circle cx="60" cy="270" r="50" fill="#cffafe" />
      <rect x="70" y="60" width="260" height="190" rx="18" fill="#fff" />
      <rect x="92" y="84" width="90" height="10" rx="5" fill="#c4b5fd" />
      <rect x="92" y="104" width="140" height="8" rx="4" fill="#e5e7eb" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={98 + i * 40} y={220 - [40, 70, 55, 100, 85][i]} width="26" height={[40, 70, 55, 100, 85][i]} rx="6" fill={i === 3 ? '#7c3aed' : '#c4b5fd'} />
      ))}
      <path d="M100 190 L140 160 L180 172 L220 130 L280 118" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="280" cy="118" r="6" fill="#f59e0b" />
    </svg>
  );
}

export function CardsIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Cartes bancaires">
      <defs>
        <linearGradient id="cd-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="cd-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" rx="24" fill="#f5f3ff" />
      <g transform="rotate(-8 200 160)">
        <rect x="70" y="60" width="240" height="150" rx="18" fill="url(#cd-b)" />
      </g>
      <g transform="rotate(6 200 190)">
        <rect x="90" y="110" width="240" height="150" rx="18" fill="url(#cd-a)" />
        <rect x="112" y="136" width="38" height="28" rx="6" fill="#fbbf24" />
        <text x="112" y="212" fontSize="15" fill="#ede9fe" fontFamily="Inter, sans-serif" letterSpacing="2">•••• •••• •••• 4821</text>
        <text x="112" y="238" fontSize="11" fill="#c4b5fd" fontFamily="Inter, sans-serif">BRUNKA BANK</text>
      </g>
    </svg>
  );
}

export function SupportIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Accompagnement client">
      <rect width="400" height="320" rx="24" fill="#fffbeb" />
      <circle cx="90" cy="80" r="46" fill="#fde68a" />
      <circle cx="330" cy="250" r="56" fill="#ddd6fe" />
      <rect x="80" y="70" width="170" height="90" rx="18" fill="#7c3aed" />
      <path d="M120 160 L120 190 L152 160 Z" fill="#7c3aed" />
      <rect x="102" y="92" width="110" height="9" rx="4.5" fill="#ede9fe" />
      <rect x="102" y="112" width="80" height="9" rx="4.5" fill="#c4b5fd" />
      <rect x="150" y="180" width="170" height="80" rx="18" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
      <path d="M290 260 L290 285 L262 260 Z" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
      <rect x="172" y="200" width="110" height="9" rx="4.5" fill="#d1d5db" />
      <rect x="172" y="220" width="70" height="9" rx="4.5" fill="#e5e7eb" />
      <circle cx="300" cy="110" r="18" fill="#f59e0b" />
      <path d="M292 110 l6 6 l11 -12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
