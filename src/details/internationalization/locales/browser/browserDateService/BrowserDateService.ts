import { AvailableLanguages } from "core/internationalization/languages";
import DateService from "core/internationalization/locales/DateService";

export default class BrowserDateService implements DateService {
    getFrDate(date: Date) {
        return date.toLocaleDateString("fr-FR");
    }

    getEnDate(date: Date) {
        return date.toLocaleDateString("en-US");
    }

    formatDate(date: Date, language: AvailableLanguages) {
        return language === AvailableLanguages.fr
            ? this.getFrDate(date)
            : this.getEnDate(date);
    }

    getTime(date: Date) {
        let hours: string | number = date.getHours();
        let minutes: string | number = date.getMinutes();

        if (hours < 10) {
            hours = `0${hours}`;
        }

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        return `${hours}:${minutes}`;
    }

    formatDateTime(date: Date, language: AvailableLanguages) {
        return `${this.formatDate(date, language)} ${this.getTime(date)}`;
    }
}