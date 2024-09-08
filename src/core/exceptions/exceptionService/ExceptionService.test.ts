import ExceptionService from './ExceptionService';
import DefaultExceptionTypes from '../DefaultExceptionTypes';
import StringsKeys from 'core/internationalization/strings/StringsKeys';
import Exception from '../Exception';

describe('ExceptionService', () => {
    const translateMock = jest.fn((key: StringsKeys) => {
        switch (key) {
            case StringsKeys.unauthorizedAction:
                return 'Unauthorized action';
            case StringsKeys.subscriptionRequired:
                return 'Subscription required';
            case StringsKeys.resourceNotFound:
                return 'Resource not found';
            case StringsKeys.invalidInfos:
                return 'Invalid information';
            case StringsKeys.conflictEncountered:
                return 'Conflict encountered';
            case StringsKeys.unavailableServer:
                return 'Server unavailable';
            case StringsKeys.unexpectedOrNetworkError:
                return 'Unexpected or network error';
            default:
                return 'Unexpected or network error';
        }
    });
    describe('handleException', () => {

        it('should handle exception and return updated exception with translated message', () => {
            const exception: Exception<unknown, DefaultExceptionTypes> = {
                type: DefaultExceptionTypes.UNAUTHORIZED,
                message: '',
                body: null,
            };

            const result = ExceptionService.handleException(exception, translateMock);

            expect(result.message).toBe('Unauthorized action');
        });

        it('should handle exception with custom translation if provided', () => {
            const exception: Exception<unknown, string> = {
                type: 'CUSTOM_ERROR',
                message: '',
                body: null,
            };

            const customTranslateException = jest.fn(() => 'Custom error message');

            const result = ExceptionService.handleException(exception, translateMock, customTranslateException);

            expect(result.message).toBe('Custom error message');
        });

        it('should handle exception with default translation if custom translation returns null', () => {
            const exception: Exception<unknown, DefaultExceptionTypes> = {
                type: DefaultExceptionTypes.UNKNOWN_ERROR,
                message: '',
                body: null,
            };

            const customTranslateException = jest.fn(() => null);

            const result = ExceptionService.handleException(exception, translateMock, customTranslateException);

            expect(result.message).toBe('Unexpected or network error');
        });

        it('should handle exception with default translation for unknown exception types', () => {
            const exception: Exception<unknown, string> = {
                type: 'UNKNOWN_EXCEPTION_TYPE',
                message: '',
                body: null,
            };

            const result = ExceptionService.handleException(exception, translateMock);

            expect(result.message).toBe('Unexpected or network error');
        });
    });

    describe('translateExceptionType', () => {
        it('should return the correct translation for DefaultExceptionTypes.UNAUTHORIZED', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.UNAUTHORIZED, translateMock);
            expect(result).toBe('Unauthorized action');
        });

        it('should return the correct translation for DefaultExceptionTypes.REQUIRE_SUBSCRIPTION', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.REQUIRE_SUBSCRIPTION, translateMock);
            expect(result).toBe('Subscription required');
        });

        it('should return the correct translation for DefaultExceptionTypes.NOT_FOUND', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.NOT_FOUND, translateMock);
            expect(result).toBe('Resource not found');
        });

        it('should return the correct translation for DefaultExceptionTypes.BAD_REQUEST', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.BAD_REQUEST, translateMock);
            expect(result).toBe('Invalid information');
        });

        it('should return the correct translation for DefaultExceptionTypes.CONFLICT', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.CONFLICT, translateMock);
            expect(result).toBe('Conflict encountered');
        });

        it('should return the correct translation for DefaultExceptionTypes.SERVER_UNAVAILABLE', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.SERVER_UNAVAILABLE, translateMock);
            expect(result).toBe('Server unavailable');
        });

        it('should return the correct translation for DefaultExceptionTypes.UNKNOWN_ERROR', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.UNKNOWN_ERROR, translateMock);
            expect(result).toBe('Unexpected or network error');
        });

        it('should return the correct translation for DefaultExceptionTypes.SERVER_ERROR', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.SERVER_ERROR, translateMock);
            expect(result).toBe('Unexpected or network error');
        });

        it('should return the custom translation if customTranslateException is provided and returns a value', () => {
            const customTranslateException = jest.fn(() => 'Custom error message');
            const result = ExceptionService.translateExceptionType('CUSTOM_ERROR', translateMock, customTranslateException);
            expect(result).toBe('Custom error message');
        });

        it('should return the default translation if customTranslateException is provided but returns null', () => {
            const customTranslateException = jest.fn(() => null);
            const result = ExceptionService.translateExceptionType(DefaultExceptionTypes.UNKNOWN_ERROR, translateMock, customTranslateException);
            expect(result).toBe('Unexpected or network error');
        });

        it('should return the default translation for unknown exception types', () => {
            const result = ExceptionService.translateExceptionType('UNKNOWN_EXCEPTION_TYPE', translateMock);
            expect(result).toBe('Unexpected or network error');
        });
    });
});
