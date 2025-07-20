export default interface CurrencyService {
    getCurrencySymbol(): string;
    setCurrency(currency: string): void;
    formatAmount(amount: number): string;
  }