// Estimation indicative de l'IFI (impôt sur la fortune immobilière, barème en vigueur en France).
// Seuil d'assujettissement : patrimoine immobilier net taxable ≥ 1 300 000 €.

const BRACKETS: Array<{ from: number; to: number; rate: number }> = [
  { from: 800_000, to: 1_300_000, rate: 0.005 },
  { from: 1_300_000, to: 2_570_000, rate: 0.007 },
  { from: 2_570_000, to: 5_000_000, rate: 0.01 },
  { from: 5_000_000, to: 10_000_000, rate: 0.0125 },
  { from: 10_000_000, to: Infinity, rate: 0.015 },
];

export interface IfiResult {
  netTaxable: number;
  ifi: number;
  subject: boolean;
}

export function estimateIfi(input: {
  totalRealEstate: number;
  primaryResidence: number;
  debts?: number;
}): IfiResult {
  const total = Math.max(0, input.totalRealEstate || 0);
  const residence = Math.min(Math.max(0, input.primaryResidence || 0), total);
  const debts = Math.max(0, input.debts || 0);
  // Abattement de 30 % sur la résidence principale, dettes déductibles.
  const netTaxable = Math.max(0, total - residence * 0.3 - debts);
  if (netTaxable < 1_300_000) return { netTaxable, ifi: 0, subject: false };

  let ifi = 0;
  for (const { from, to, rate } of BRACKETS) {
    if (netTaxable > from) ifi += (Math.min(netTaxable, to) - from) * rate;
  }
  // Décote entre 1,3 M€ et 1,4 M€.
  if (netTaxable < 1_400_000) ifi = Math.max(0, ifi - (17_500 - 0.0125 * netTaxable));
  return { netTaxable, ifi: Math.round(ifi), subject: true };
}
