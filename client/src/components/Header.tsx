import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import DemoBanner from '@/components/DemoBanner';
import { logout, useSession } from '@/lib/auth';

const NAV = [
  { href: '/ma-banque', label: 'Ma Banque' },
  { href: '/epargne', label: 'Épargne' },
  { href: '/demander-pret', label: 'Demander un prêt' },
  { href: '/assurance', label: 'Assurance' },
  { href: '/credits', label: 'Crédits' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const user = useSession();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setLocation('/');
  };

  const linkClass = (href: string) =>
    `transition-colors font-medium ${location === href ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`;

  return (
    <>
      <DemoBanner />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center space-x-8" aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" className="text-purple-600" onClick={() => setLocation('/dashboard')}>
                  Mon espace
                </Button>
                <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-purple-600" onClick={() => setLocation('/login')}>Se Connecter</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setLocation('/signup')}>Devenir Client</Button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="container mx-auto px-4 flex flex-col space-y-4" aria-label="Navigation mobile">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className={`${linkClass(item.href)} text-left`} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Button variant="ghost" className="text-purple-600 w-full" onClick={() => { setIsMenuOpen(false); setLocation('/dashboard'); }}>Mon espace</Button>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>Déconnexion</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="text-purple-600 w-full" onClick={() => { setIsMenuOpen(false); setLocation('/login'); }}>Se Connecter</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full" onClick={() => { setIsMenuOpen(false); setLocation('/signup'); }}>Devenir Client</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
