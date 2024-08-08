import SetCurrentLanguageUseCase from './SetCurrentLanguageUseCase';
import LanguageRepository from '../../LanguageRepository';
import { Language, AvailableLanguages } from '../../languages';

describe('SetCurrentLanguageUseCase', () => {
  let languageRepository: LanguageRepository;
  let setCurrentLanguageUseCase: SetCurrentLanguageUseCase;

  beforeEach(() => {
    languageRepository = {
      setCurrentLanguage: jest.fn()
    } as unknown as LanguageRepository;
    setCurrentLanguageUseCase = new SetCurrentLanguageUseCase(languageRepository);
  });

  test('should call setCurrentLanguage on the repository', async () => {
    const mockLanguage: Language = { code: AvailableLanguages.en, direction: 'ltr' };
    (languageRepository.setCurrentLanguage as jest.Mock).mockResolvedValue(undefined);

    await setCurrentLanguageUseCase.execute(mockLanguage);

    expect(languageRepository.setCurrentLanguage).toHaveBeenCalledWith(mockLanguage);
  });
});