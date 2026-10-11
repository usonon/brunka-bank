import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { BRAND } from '@/lib/brand';

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Préremplissage depuis un lien (ex. /contact?sujet=loan&message=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sujet = params.get('sujet');
    const message = params.get('message');
    const allowed = ['support', 'account', 'loan', 'insurance', 'other'];
    if (sujet || message) {
      setFormData((prev) => ({
        ...prev,
        subject: sujet && allowed.includes(sujet) ? sujet : prev.subject,
        message: message ?? prev.message,
      }));
    }
  }, []);

  const subjectLabels: Record<string, string> = {
    support: 'Support Client',
    account: 'Compte Bancaire',
    loan: 'Demande de Prêt',
    insurance: 'Assurance',
    other: 'Autre',
  };

  // Aucun serveur n'est relié au site : le message est préparé dans l'application de messagerie de l'utilisateur.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[${subjectLabels[formData.subject] ?? 'Contact'}] Message de ${formData.name}`;
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Votre messagerie s'ouvre : envoyez le message pour finaliser votre demande.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: BRAND.email,
      description: 'Écrivez-nous, nous vous répondrons dès que possible'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: BRAND.phones.join(' / '),
      description: 'Disponible du lundi au vendredi 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: BRAND.address,
      description: 'Adresse postale'
    },
    {
      icon: Clock,
      title: 'Horaires',
      value: BRAND.hours,
      description: 'Sam-Dim: Fermé'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nous Contacter</h1>
            <p className="text-xl text-indigo-100 max-w-2xl">
              Vous avez une question ? Notre équipe est là pour vous aider.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <Icon className="w-8 h-8 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                    <p className="font-semibold text-indigo-600 mb-2">{info.value}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Envoyez-nous un Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom Complet
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sujet
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="support">Support Client</option>
                      <option value="account">Compte Bancaire</option>
                      <option value="loan">Demande de Prêt</option>
                      <option value="insurance">Assurance</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-semibold"
                  >
                    Envoyer le Message
                  </Button>
                </form>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Informations Utiles</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Temps de Réponse</h3>
                    <p className="text-gray-700">
                      Nous nous efforçons de répondre à tous les messages dans les 24 heures. Pour les demandes urgentes, appelez-nous directement.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Support Technique</h3>
                    <p className="text-gray-700">
                      Pour les problèmes techniques avec votre compte ou l'application, contactez notre support technique à <span className="font-semibold">{BRAND.supportEmail}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Demandes Commerciales</h3>
                    <p className="text-gray-700">
                      Pour les partenariats et demandes commerciales, écrivez à <span className="font-semibold">{BRAND.businessEmail}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Réclamations</h3>
                    <p className="text-gray-700">
                      Si vous avez une réclamation, utilisez le formulaire ci-dessus (sujet « Support Client ») ou écrivez-nous directement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Questions Fréquemment Posées
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: 'Comment ouvrir un compte ?',
                  a: 'Vous pouvez faire une demande d\'ouverture de compte en ligne depuis la page "Devenir Client".'
                },
                {
                  q: 'Quels sont vos frais bancaires ?',
                  a: 'Consultez notre page "Ma Banque" pour découvrir nos services et leurs conditions.'
                },
                {
                  q: 'Comment puis-je accéder à mon compte ?',
                  a: 'Vous pouvez accéder à votre espace client depuis la page "Se Connecter" avec vos identifiants.'
                },
                {
                  q: 'Que faire en cas de problème avec ma carte ?',
                  a: 'Contactez notre support client dès que possible afin de demander le blocage de votre carte et son remplacement.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Besoin d'Aide ?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Notre équipe est prête à vous aider. N'hésitez pas à nous contacter.
            </p>
            <Button 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={() => setLocation('/')}
            >
              Retour à l'accueil
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
