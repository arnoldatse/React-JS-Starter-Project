import DateService from "core/internationalization/locales/DateService";
import BrowserDateService from "details/internationalization/locales/browser/browserDateService/BrowserDateService";

const dateService: DateService = new BrowserDateService();

export default dateService;