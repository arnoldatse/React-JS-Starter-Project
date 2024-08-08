import GetCurrentLanguageUsecase from './GetCurrentlanguageUsecase';
import LanguageRepository from '../../LanguageRepository';
import { AvailableLanguages, Language } from '../../languages';

describe('GetCurrentLanguageUsecase', () => {
  let languageRepository: LanguageRepository;
  let getCurrentLanguageUsecase: GetCurrentLanguageUsecase;

  beforeEach(() => {
    languageRepository = {
      getCurrentLanguage: jest.fn()
    } as unknown as LanguageRepository;
    getCurrentLanguageUsecase = new GetCurrentLanguageUsecase(languageRepository);
  });

  test('should call getCurrentLanguage on the repository', async () => {
    const mockLanguage: Language = { code: AvailableLanguages.en, direction: 'ltr' };
    (languageRepository.getCurrentLanguage as jest.Mock).mockResolvedValue(mockLanguage);

    const result = await getCurrentLanguageUsecase.execute();

    expect(languageRepository.getCurrentLanguage).toHaveBeenCalled();
    expect(result).toBe(mockLanguage);
  });
});