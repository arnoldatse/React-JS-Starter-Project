import CurrencyService from "core/internationalization/locales/CurrencyService";

export default class BrowserCurrencyService implements CurrencyService {
    private currency = 'CFA';
    private readonly local = navigator.language;

    getCurrencySymbol(): string {
        return this.currency;
    }

    setCurrency(currency: string) {
        this.currency = currency;
    }

    formatAmount(amount: number): string {
        return new Intl.NumberFormat(this.local, { style: 'currency', currency: this.currency }).format(amount);
    }
}