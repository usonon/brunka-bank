import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreditCard, TrendingUp, Send, Plus, LogOut, Eye, EyeOff } from 'lucide-react';
import { useSession, logout } from '@/lib/auth';
import {
  listAccounts,
  listTransactions,
  createAccount,
  createTransfer,
  translateApiError,
  type AccountType,
  type ApiAccount,
  type ApiTransaction,
} from '@/lib/api';

const TYPE_LABELS: Record<AccountType, string> = {
  checking: 'Compte chèques',
  savings: 'Épargne',
  investment: 'Investissements',
};

const KIND_TO_TYPE: Record<string, AccountType> = {
  'Épargne': 'savings',
  'Compte chèques': 'checking',
  Investissements: 'investment',
};

interface FeedTransaction extends ApiTransaction {
  accountName: string;
}

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formatEur = (cents: number) => (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const user = useSession();
  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState<ApiAccount[] | null>(null);
  const [transactions, setTransactions] = useState<FeedTransaction[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferBeneficiary, setTransferBeneficiary] = useState('');
  const [transferIban, setTransferIban] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSubmitting, setTransferSubmitting] = useState(false);
  const [transferKey, setTransferKey] = useState('');

  const [newAccountOpen, setNewAccountOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountKind, setNewAccountKind] = useState('Épargne');
  const [newAccountSubmitting, setNewAccountSubmitting] = useState(false);

  // N'envoie vers /login qu'une fois la session confirmée absente —
  // `undefined` veut dire "en cours de vérification", pas "déconnecté".
  useEffect(() => {
    if (user === null) setLocation('/login');
  }, [user, setLocation]);

  const refresh = useCallback(async () => {
    try {
      const { accounts: accs } = await listAccounts();
      setAccounts(accs);
      const perAccount = await Promise.all(
        accs.map((acc) => listTransactions(acc.id, 20).then((r) => r.transactions.map((t) => ({ ...t, accountName: acc.name }))))
      );
      const merged = perAccount
        .flat()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTransactions(merged);
      setLoadError(null);
    } catch (err) {
      setLoadError(translateApiError(err));
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const totalBalanceCents = useMemo(() => (accounts ?? []).reduce((sum, a) => sum + a.balance_cents, 0), [accounts]);
  const totalInCents = transactions.filter((t) => t.direction === 'credit').reduce((s, t) => s + t.amount_cents, 0);
  const totalOutCents = transactions.filter((t) => t.direction === 'debit').reduce((s, t) => s + t.amount_cents, 0);
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 5);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const openTransfer = () => {
    if (!accounts || accounts.length === 0) {
      toast.error('Aucun compte disponible pour effectuer un virement');
      return;
    }
    setTransferFrom(String(accounts[0].id));
    setTransferTo('external');
    setTransferBeneficiary('');
    setTransferIban('');
    setTransferAmount('');
    setTransferKey(crypto.randomUUID());
    setTransferOpen(true);
  };

  const submitTransfer = async () => {
    if (!accounts) return;
    const amount = parseFloat(transferAmount.replace(',', '.'));
    const from = accounts.find((a) => String(a.id) === transferFrom);
    if (!from) return toast.error('Choisissez le compte à débiter');
    if (!amount || amount <= 0) return toast.error('Saisissez un montant valide');
    const amountCents = Math.round(amount * 100);
    if (amountCents > from.balance_cents) return toast.error('Solde insuffisant sur le compte sélectionné');

    setTransferSubmitting(true);
    try {
      if (transferTo === 'external') {
        if (!transferBeneficiary.trim()) {
          toast.error('Indiquez le nom du bénéficiaire');
          return;
        }
        await createTransfer(
          {
            fromAccountId: from.id,
            amountCents,
            toIban: transferIban.trim(),
            toName: transferBeneficiary.trim(),
            label: `Virement vers ${transferBeneficiary.trim()}`,
          },
          transferKey
        );
      } else {
        const toAccountId = Number(transferTo);
        const dest = accounts.find((a) => a.id === toAccountId);
        if (!dest || dest.id === from.id) {
          toast.error('Choisissez un compte de destination différent');
          return;
        }
        await createTransfer(
          { fromAccountId: from.id, toAccountId: dest.id, amountCents, label: `Virement vers ${dest.name}` },
          transferKey
        );
      }
      setTransferOpen(false);
      toast.success(`Virement de ${formatEur(amountCents)} effectué`);
      await refresh();
    } catch (err) {
      toast.error(translateApiError(err));
    } finally {
      setTransferSubmitting(false);
    }
  };

  const submitNewAccount = async () => {
    const name = newAccountName.trim() || `Compte ${newAccountKind}`;
    setNewAccountSubmitting(true);
    try {
      await createAccount({ type: KIND_TO_TYPE[newAccountKind], name });
      setNewAccountOpen(false);
      setNewAccountName('');
      toast.success(`Compte « ${name} » créé`);
      await refresh();
    } catch (err) {
      toast.error(translateApiError(err));
    } finally {
      setNewAccountSubmitting(false);
    }
  };

  if (!user || !accounts) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-24">
          {loadError ? (
            <p className="text-gray-600">{loadError}</p>
          ) : (
            <p className="text-gray-500">Chargement de votre espace…</p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <p className="text-purple-100 mb-2">Bienvenue,</p>
                <h1 className="text-3xl md:text-4xl font-bold capitalize">{user.name}</h1>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100">Solde total</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-purple-100 hover:text-white"
                  aria-label={showBalance ? 'Masquer les soldes' : 'Afficher les soldes'}
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-4xl font-bold">{showBalance ? formatEur(totalBalanceCents) : '••••••'}</p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <p className="text-xs text-gray-500 mb-6">
              Espace client relié à un vrai back-end de démonstration : les comptes et virements sont enregistrés
              dans une base de données, mais aucun argent réel n'est en jeu — le solde de départ est crédité
              automatiquement à la création du compte.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Mes Comptes</h2>
                  <Button
                    onClick={() => setNewAccountOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nouveau compte
                  </Button>
                </div>

                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{account.name}</h3>
                          <p className="text-sm text-gray-600">{TYPE_LABELS[account.type]}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-purple-600" />
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Solde</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {showBalance ? formatEur(account.balance_cents) : '••••••'}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">IBAN : {account.iban}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => {
                            openTransfer();
                            setTransferFrom(String(account.id));
                          }}
                        >
                          <Send className="w-4 h-4" />
                          Virement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Actions Rapides</h2>

                <div className="space-y-3">
                  <Button
                    onClick={openTransfer}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Effectuer un virement
                  </Button>

                  <Button
                    onClick={() => setLocation('/epargne')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Investir
                  </Button>

                  <Button variant="outline" className="w-full font-semibold py-6" onClick={() => setLocation('/demander-pret')}>
                    Demander un prêt
                  </Button>

                  <Button variant="outline" className="w-full font-semibold py-6" onClick={() => setLocation('/contact?sujet=support')}>
                    Contacter le support
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-1">Statistiques</h3>
                  <p className="text-xs text-gray-500 mb-4">Sur les dernières opérations</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dépenses</span>
                      <span className="font-bold text-gray-900">{formatEur(totalOutCents)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenus</span>
                      <span className="font-bold text-green-600">{formatEur(totalInCents)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-purple-200">
                      <span className="text-sm text-gray-600">Solde des opérations</span>
                      <span className="font-bold text-purple-600">{formatEur(totalInCents - totalOutCents)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dernières Transactions</h2>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Compte</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {visibleTransactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            Aucune transaction pour le moment.
                          </td>
                        </tr>
                      )}
                      {visibleTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {transaction.label || transaction.counterparty || (transaction.direction === 'credit' ? 'Virement reçu' : 'Virement émis')}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{transaction.accountName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{dateLabel(transaction.created_at)}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-bold ${transaction.direction === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                              {transaction.direction === 'credit' ? '+' : '-'}
                              {formatEur(transaction.amount_cents)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {transactions.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="font-semibold" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Réduire la liste' : 'Voir toutes les transactions'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Effectuer un virement</DialogTitle>
            <DialogDescription>Enregistré sur le serveur de démonstration — aucun argent réel n'est transféré.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="tf-from" className="block text-sm font-semibold text-gray-700 mb-1">Compte à débiter</label>
              <select id="tf-from" value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({formatEur(a.balance_cents)})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tf-to" className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
              <select id="tf-to" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="external">Bénéficiaire externe (IBAN)</option>
                {accounts.filter((a) => String(a.id) !== transferFrom).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {transferTo === 'external' && (
              <>
                <div>
                  <label htmlFor="tf-name" className="block text-sm font-semibold text-gray-700 mb-1">Nom du bénéficiaire</label>
                  <Input id="tf-name" value={transferBeneficiary} onChange={(e) => setTransferBeneficiary(e.target.value)} placeholder="Nom et prénom" />
                </div>
                <div>
                  <label htmlFor="tf-iban" className="block text-sm font-semibold text-gray-700 mb-1">IBAN</label>
                  <Input id="tf-iban" value={transferIban} onChange={(e) => setTransferIban(e.target.value)} placeholder="FR76 …" />
                </div>
              </>
            )}
            <div>
              <label htmlFor="tf-amount" className="block text-sm font-semibold text-gray-700 mb-1">Montant (€)</label>
              <Input id="tf-amount" inputMode="decimal" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0,00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>Annuler</Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={submitTransfer}
              disabled={transferSubmitting}
            >
              {transferSubmitting ? 'Envoi…' : 'Valider le virement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newAccountOpen} onOpenChange={setNewAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau compte</DialogTitle>
            <DialogDescription>Le compte est créé avec un solde nul.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="na-kind" className="block text-sm font-semibold text-gray-700 mb-1">Type de compte</label>
              <select id="na-kind" value={newAccountKind} onChange={(e) => setNewAccountKind(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Épargne</option>
                <option>Compte chèques</option>
                <option>Investissements</option>
              </select>
            </div>
            <div>
              <label htmlFor="na-name" className="block text-sm font-semibold text-gray-700 mb-1">Nom du compte (facultatif)</label>
              <Input id="na-name" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Ex. Projet vacances" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewAccountOpen(false)}>Annuler</Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={submitNewAccount}
              disabled={newAccountSubmitting}
            >
              {newAccountSubmitting ? 'Création…' : 'Créer le compte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
