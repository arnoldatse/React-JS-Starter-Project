import LocalStorageLanguageRepository from "details/storage/localStorage/repositories/LocalStorageLanguageRepository";

interface InternationalizationAdapter {
  init: (languageRepository: LocalStorageLanguageRepository) => void;
}

export default InternationalizationAdapter;
