import { AvailableLanguages } from "../languages";

export default interface DateService {
    getFrDate(date: Date): string;
    getEnDate(date: Date): string;
    formatDate(date: Date, language: AvailableLanguages): string;
    getTime(date: Date): string;
    formatDateTime(date: Date, language: AvailableLanguages): string;
  }