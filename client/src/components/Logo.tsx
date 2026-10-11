import { BRAND } from '@/lib/brand';

export default function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label={BRAND.name}>
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="9" fill="#7c3aed" />
        <path
          d="M11 8h7.2c3.2 0 5.3 1.7 5.3 4.4 0 1.8-1 3.1-2.6 3.7 2.1.5 3.5 2 3.5 4.3 0 3.1-2.4 4.9-5.9 4.9H11V8Zm4 3.3v3.4h2.7c1.2 0 1.9-.6 1.9-1.7s-.7-1.7-1.9-1.7H15Zm0 6.5v3.6h3c1.3 0 2.1-.7 2.1-1.8s-.8-1.8-2.1-1.8h-3Z"
          fill="#fff"
        />
      </svg>
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
        Brunka<span className={light ? 'text-purple-300' : 'text-purple-600'}> Bank</span>
      </span>
    </span>
  );
}
