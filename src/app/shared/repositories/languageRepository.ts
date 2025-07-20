import LanguageRepository from "core/internationalization/LanguageRepository";
import LocalStorageLanguageRepository from "details/storage/localStorage/repositories/localStorageLanguageRepository/LocalStorageLanguageRepository";

const languageRepository: LanguageRepository = new LocalStorageLanguageRepository();

export default languageRepository;