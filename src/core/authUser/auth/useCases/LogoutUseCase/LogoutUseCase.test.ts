import LogoutUseCase from './LogoutUseCase';
import SessionStorageService from '../../services/sessionStorageService/SessionStorageService';
import DefaultExceptionType from 'core/exceptions/DefaultExceptionType';
import ExceptionService from 'core/exceptions/exceptionService/ExceptionService';
import StoreAuthDataRepository from '../../repositories/StoreAuthDataRepository';
import AppNavigator from 'core/navigation/AppNavigator';
import PublicNavigationLocation from 'core/navigation/PublicNavigationLocation';

describe('LogoutUseCase', () => {
    describe('execute', () => {
        let logoutUseCase: LogoutUseCase;
        let storeAuthDataRepositoryMock: jest.Mocked<StoreAuthDataRepository>;
        let sessionStorageService: SessionStorageService;
        let navigator: jest.Mocked<AppNavigator>;
        let translate: jest.Mock;

        beforeEach(() => {
            storeAuthDataRepositoryMock = {
                save: jest.fn(),
                get: jest.fn(),
                remove: jest.fn()
            };
            sessionStorageService = SessionStorageService.getInstance(storeAuthDataRepositoryMock);

            navigator = {
                navigate: jest.fn(),
                clearHistoryAndNavigate: jest.fn(),
                redirect: jest.fn(),
                clearHistory: jest.fn(),
                canNavigateToPreviousLocation: jest.fn(),
                navigateToPreviousLocation: jest.fn(),
                canNavigateToNextLocation: jest.fn(),
                navigateToNextLocation: jest.fn(),
                getPreviousLocation: jest.fn(),
                getNextLocation: jest.fn(),
                getCurrentLocation: jest.fn(),
            };
            translate = jest.fn();

            logoutUseCase = new LogoutUseCase();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should execute logout and remove session data', async () => {
            const sessionStorageServiceRemoveSpy = jest.spyOn(sessionStorageService, 'remove').mockResolvedValue();

            await logoutUseCase.execute(navigator, translate);

            expect(sessionStorageServiceRemoveSpy).toHaveBeenCalledTimes(1);
            expect(navigator.clearHistoryAndNavigate).toHaveBeenNthCalledWith(1, PublicNavigationLocation.HOME);
        });

        it('should throw an exception if remove fails', async () => {
            const exception = { type: DefaultExceptionType.UNKNOWN_ERROR, body: 'Unexpected error' };

            jest.spyOn(sessionStorageService, 'remove').mockRejectedValue(exception);

            ExceptionService.handleException = jest.fn().mockReturnValue(exception);

            await expect(logoutUseCase.execute(navigator, translate)).rejects.toBe(exception);
        });

        it('should throw an unknown error if an unexpected error occurs', async () => {
            const unexpectedError = new Error('Unexpected error');
            const exception = { type: DefaultExceptionType.UNKNOWN_ERROR, body: unexpectedError };

            jest.spyOn(sessionStorageService, 'remove').mockRejectedValue(unexpectedError);

            ExceptionService.handleException = jest.fn().mockReturnValue(exception);

            await expect(logoutUseCase.execute(navigator, translate)).rejects.toEqual(exception);
        });
    });
});