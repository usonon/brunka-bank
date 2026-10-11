import { useState } from 'react';
import { Link } from 'wouter';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { BRAND } from '@/lib/brand';

const linkClass = 'text-gray-400 hover:text-white transition-colors';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Veuillez saisir une adresse e-mail valide');
      return;
    }
    try {
      const key = 'brunka:newsletter';
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!list.includes(email.trim().toLowerCase())) list.push(email.trim().toLowerCase());
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* stockage indisponible : on confirme quand même l'inscription simulée */
    }
    toast.success('Merci ! Votre inscription à la lettre d\'information est enregistrée.');
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Restez informé de notre actualité et de nos conseils bancaires
            </h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3" noValidate>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre e-mail"
                aria-label="Adresse e-mail"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8">
                S'abonner
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="inline-block mb-4">
                <Logo light />
              </Link>
              <p className="text-gray-400 text-sm">
                Vos comptes, votre épargne et vos projets réunis dans un seul espace.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Nos offres</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/epargne" className={linkClass}>Épargne</Link></li>
                <li><Link href="/assurance" className={linkClass}>Assurance</Link></li>
                <li><Link href="/credits" className={linkClass}>Crédits</Link></li>
                <li><Link href="/demander-pret" className={linkClass}>Demander un prêt</Link></li>
                <li><Link href="/card-comparator" className={linkClass}>Cartes bancaires</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Action</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/signup" className={linkClass}>Devenir Client</Link></li>
                <li><Link href="/login" className={linkClass}>Se Connecter</Link></li>
                <li><Link href="/aide" className={linkClass}>Aide</Link></li>
                <li><Link href="/contact" className={linkClass}>Nous contacter</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-purple-500" />
                  <p className="text-gray-400">{BRAND.address}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 flex-shrink-0 text-purple-500" />
                  <a href={`mailto:${BRAND.email}`} className={linkClass}>{BRAND.email}</a>
                </div>
                <div className="flex items-start">
                  <Phone className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-purple-500" />
                  <a href={BRAND.phoneHref} className={linkClass}>{BRAND.phones.join(' / ')}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 space-y-3 text-center">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <li><Link href="/mentions-legales" className={linkClass}>Mentions légales</Link></li>
              <li><Link href="/conditions" className={linkClass}>Conditions d'utilisation</Link></li>
              <li><Link href="/confidentialite" className={linkClass}>Confidentialité</Link></li>
            </ul>
            <p className="text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} {BRAND.name} – Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
