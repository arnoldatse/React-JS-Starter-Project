import BrowserCurrencyService from './BrowserCurrencyService';

describe('BrowserCurrencyService', () => {
    let browserCurrencyService: BrowserCurrencyService;

    beforeAll(() => {
        jest.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR');
    });

    beforeEach(() => {
        browserCurrencyService = new BrowserCurrencyService();
    });

    it('should return the correct currency symbol', () => {
        expect(browserCurrencyService.getCurrencySymbol()).toBe('CFA');
    });

    it('should set the currency correctly', () => {
        browserCurrencyService.setCurrency('$');
        expect(browserCurrencyService.getCurrencySymbol()).toBe('$');

        browserCurrencyService.setCurrency('€');
        expect(browserCurrencyService.getCurrencySymbol()).toBe('€');
    });

    it('should format the amount format correctly based on the locale', () => {
        //locale fr-FR

        //For the fr-FR locale, the thousands separator is a space and the decimal separator is a comma.
        const decimalFrAmount = 1000.50;
        const formattedDecimalFrAmount = browserCurrencyService.formatAmount(decimalFrAmount);
        const expectedFormattedDecimalFrAmount = '1 000,50 CFA';

        //For the fr-FR locale, the thousands separator is a space and the decimal separator is a comma.
        const integerFrAmount = 1000;
        const formattedIntegerFrAmount = browserCurrencyService.formatAmount(integerFrAmount);
        const expectedFormattedIntegerFrAmount = '1 000,00 CFA';

        //locale en-US
        jest.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
        const enBrowserCurrencyService = new BrowserCurrencyService();

        //For the en-US locale, the thousands separator is a comma and the decimal separator is a period.
        const decimalEnAmount = 1000.50;
        const formattedDecimalEnAmount = enBrowserCurrencyService.formatAmount(decimalEnAmount);
        const expectedFormattedDecimalEnAmount = 'CFA 1,000.50';

        //For the en-US locale, the thousands separator is a comma and the decimal separator is a period.
        const integerEnAmount = 1000;
        const formattedIntegerEnAmount = enBrowserCurrencyService.formatAmount(integerEnAmount);
        const expectedFormattedIntegerEnAmount = 'CFA 1,000.00';

        expect(formattedDecimalFrAmount.replace(/[\u00A0\u202F]/g, ' ')).toEqual(expectedFormattedDecimalFrAmount);
        expect(formattedIntegerFrAmount.replace(/[\u00A0\u202F]/g, ' ')).toEqual(expectedFormattedIntegerFrAmount);

        expect(formattedDecimalEnAmount.replace(/[\u00A0\u202F]/g, ' ')).toEqual(expectedFormattedDecimalEnAmount);
        expect(formattedIntegerEnAmount.replace(/[\u00A0\u202F]/g, ' ')).toEqual(expectedFormattedIntegerEnAmount);
    });
});