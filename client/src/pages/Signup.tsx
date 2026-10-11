import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { register } from '@/lib/auth';
import { BRAND } from '@/lib/brand';

export default function Signup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (!formData.acceptTerms) {
      toast.error('Vous devez accepter les conditions d\'utilisation');
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSubmitted(true);
      toast.success(`Inscription réussie ! Bienvenue chez ${BRAND.name}`);
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1500);
    } catch {
      toast.error('Inscription impossible pour le moment. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        
        <main className="flex-1 flex items-center justify-center py-16 md:py-24">
          <div className="text-center max-w-md">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="w-24 h-24 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Inscription réussie !</h1>
            <p className="text-xl text-gray-600 mb-8">
              Bienvenue chez {BRAND.name}. Vous allez être redirigé vers votre espace client.
            </p>
            <Button 
              onClick={() => setLocation('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6 rounded-lg text-base"
            >
              Accéder à mon espace
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Devenir Client {BRAND.name}</h1>
            <p className="text-xl text-purple-100">Rejoignez nos clients satisfaits et accédez à nos services bancaires premium</p>
          </div>
        </section>

        {/* Signup Form Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-purple-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Créer votre compte</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jean"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Dupont"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">Minimum 8 caractères</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                    J'accepte les <Link href="/conditions" className="font-semibold text-purple-600 hover:underline">conditions d'utilisation</Link> et la <Link href="/confidentialite" className="font-semibold text-purple-600 hover:underline">politique de confidentialité</Link> de {BRAND.name} *
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg rounded-lg"
                >
                  {loading ? 'Création…' : 'Créer mon compte'}
                </Button>

                <p className="text-center text-gray-600">
                  Vous avez déjà un compte ? <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700">Se connecter</Link>
                </p>
              </form>
            </div>

            {/* Benefits Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Avantages de rejoindre {BRAND.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏦</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Services Bancaires Complets</h4>
                  <p className="text-gray-700">Accès à l'ensemble de nos produits et services depuis un seul espace</p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">🔒</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Confidentialité</h4>
                  <p className="text-gray-700">Vos informations sont traitées conformément à notre politique de confidentialité</p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-4">💰</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Conditions Transparentes</h4>
                  <p className="text-gray-700">Consultez nos taux et conditions avant de vous engager</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
