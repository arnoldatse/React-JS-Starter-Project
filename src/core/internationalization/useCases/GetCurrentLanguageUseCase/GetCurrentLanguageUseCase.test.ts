import GetCurrentLanguageUseCase from './GetCurrentLanguageUseCase';
import LanguageRepository from '../../LanguageRepository';
import { AvailableLanguages, Language } from '../../languages';

describe('GetCurrentLanguageUseCase', () => {
  let languageRepository: LanguageRepository;
  let getCurrentLanguageUseCase: GetCurrentLanguageUseCase;

  beforeEach(() => {
    languageRepository = {
      getCurrentLanguage: jest.fn()
    } as unknown as LanguageRepository;
    getCurrentLanguageUseCase = new GetCurrentLanguageUseCase(languageRepository);
  });

  test('should call getCurrentLanguage on the repository', async () => {
    const mockLanguage: Language = { code: AvailableLanguages.en, direction: 'ltr' };
    (languageRepository.getCurrentLanguage as jest.Mock).mockResolvedValue(mockLanguage);

    const result = await getCurrentLanguageUseCase.execute();

    expect(languageRepository.getCurrentLanguage).toHaveBeenCalled();
    expect(result).toBe(mockLanguage);
  });
});