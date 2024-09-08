import LogoutUsecase from './LogoutUseCase';
import SessionStorageService from '../../services/sessionStorageService/SessionStorageService';
import DefaultExceptionTypes from 'core/exceptions/DefaultExceptionTypes';
import ExceptionService from 'core/exceptions/exceptionService/ExceptionService';
import routesPaths from 'core/routes/routesPaths';

jest.mock('../../services/sessionStorageService/SessionStorageService');
jest.mock('core/exceptions/exceptionService/ExceptionService');

describe('LogoutUsecase', () => {
    describe('execute', () => {
        let logoutUsecase: LogoutUsecase;
        let sessionStorageService: jest.Mocked<SessionStorageService>;
        let navigate: jest.Mock;
        let translate: jest.Mock;

        beforeEach(() => {
            sessionStorageService = {
                setPersist: jest.fn(),
                setUnpersist: jest.fn(),
                save: jest.fn(),
                remove: jest.fn(),
            };

            (SessionStorageService.getInstance as jest.Mock).mockReturnValue(sessionStorageService);

            navigate = jest.fn();
            translate = jest.fn();

            logoutUsecase = new LogoutUsecase();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should execute logout and remove session data', async () => {
            sessionStorageService.remove.mockResolvedValue();

            await logoutUsecase.execute(navigate, translate);

            expect(sessionStorageService.remove).toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith(routesPaths.LOGIN);
        });

        it('should throw an exception if remove fails', async () => {
            const exception = { type: DefaultExceptionTypes.UNKNOWN_ERROR, body: 'Unexpected error' };

            sessionStorageService.remove.mockRejectedValue(exception);

            (ExceptionService.handleException as jest.Mock).mockReturnValue(exception);

            await expect(logoutUsecase.execute(navigate, translate)).rejects.toBe(exception);
        });

        it('should throw an unknown error if an unexpected error occurs', async () => {
            const unexpectedError = new Error('Unexpected error');
            const exception = { type: DefaultExceptionTypes.UNKNOWN_ERROR, body: unexpectedError };

            sessionStorageService.remove.mockRejectedValue(unexpectedError);

            (ExceptionService.handleException as jest.Mock).mockReturnValue(exception);

            await expect(logoutUsecase.execute(navigate, translate)).rejects.toEqual(exception);
        });
    });
});