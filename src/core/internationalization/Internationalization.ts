import LanguageRepository from "./LanguageRepository";

interface Internationalization {
  init: (languageRepository: LanguageRepository) => void;
}

export default Internationalization;
