import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_ACCOUNT, login } from '@/lib/auth';
import { BRAND } from '@/lib/brand';

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

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
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success('Connexion réussie !');
      setLocation('/dashboard');
    } catch {
      toast.error('Connexion impossible pour le moment. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Se Connecter</h1>
            <p className="text-xl text-purple-100">Accédez à votre espace personnel {BRAND.name}</p>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-purple-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Connexion</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    autoComplete="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    autoComplete="current-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label className="text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg rounded-lg"
                >
                  {loading ? 'Connexion…' : 'Se Connecter'}
                </Button>

                <p className="text-center text-gray-600">
                  Pas encore client ? <Link href="/signup" className="text-purple-600 font-semibold hover:text-purple-700">Créer un compte</Link>
                </p>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 pt-8 border-t border-purple-200">
                <p className="text-xs text-gray-600 mb-3 font-semibold">Identifiants de démonstration :</p>
                <div className="bg-white rounded-lg p-4 text-xs text-gray-700 space-y-1">
                  <p><span className="font-semibold">Email :</span> {DEMO_ACCOUNT.email}</p>
                  <p><span className="font-semibold">Mot de passe :</span> {DEMO_ACCOUNT.password}</p>
                </div>
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-purple-600 hover:text-purple-700"
                  onClick={() => setFormData((prev) => ({ ...prev, email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password }))}
                >
                  Remplir automatiquement
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
