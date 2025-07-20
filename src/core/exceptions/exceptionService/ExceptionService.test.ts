import ExceptionService from './ExceptionService';
import DefaultExceptionType from '../DefaultExceptionType';
import StringsKey from 'core/internationalization/strings/StringsKey';
import Exception from '../Exception';

describe('ExceptionService', () => {
    const unauthorizedActionMessage = 'Unauthorized action';
    const subscriptionRequiredMessage = 'Subscription required';
    const resourceNotFoundMessage = 'Resource not found';
    const invalidInfosMessage = 'Invalid information';
    const conflictEncounteredMessage = 'Conflict encountered';
    const externalResourceUnavailableMessage = 'External resource unavailable';
    const unexpectedErrorMessage = 'Unexpected error';

    const translateMock = jest.fn((key: StringsKey) => {
        switch (key) {
            case StringsKey.unauthorizedAction:
                return unauthorizedActionMessage;
            case StringsKey.subscriptionRequired:
                return subscriptionRequiredMessage;
            case StringsKey.resourceNotFound:
                return resourceNotFoundMessage;
            case StringsKey.invalidInfos:
                return invalidInfosMessage;
            case StringsKey.conflictEncountered:
                return conflictEncounteredMessage;
            case StringsKey.externalResourceUnavailable:
                return externalResourceUnavailableMessage;
            case StringsKey.unexpectedError:
                return unexpectedErrorMessage;
            default:
                return unexpectedErrorMessage;
        }
    });
    describe('handleException', () => {
        it('should handle exception and return updated exception with translated message', () => {
            const exception: Exception<unknown, DefaultExceptionType> = {
                type: DefaultExceptionType.UNAUTHORIZED,
                message: '',
                body: null,
            };

            const result = ExceptionService.handleException(exception, translateMock);

            expect(result.message).toBe(unauthorizedActionMessage);
        });

        it('should handle exception with custom translation if provided', () => {
            const exception: Exception<unknown, string> = {
                type: 'CUSTOM_ERROR',
                message: '',
                body: null,
            };

            const customErrorMessage = 'Custom error message';

            const customTranslateException = jest.fn(() => customErrorMessage);

            const result = ExceptionService.handleException(exception, translateMock, customTranslateException);

            expect(result.message).toBe(customErrorMessage);
        });

        it('should handle exception with default translation if custom translation returns null', () => {
            const exception: Exception<unknown, DefaultExceptionType> = {
                type: DefaultExceptionType.UNKNOWN_ERROR,
                message: '',
                body: null,
            };

            const customTranslateException = jest.fn(() => null);

            const result = ExceptionService.handleException(exception, translateMock, customTranslateException);

            expect(result.message).toBe(unexpectedErrorMessage);
        });

        it('should handle exception with default translation for unknown exception types', () => {
            const exception: Exception<unknown, string> = {
                type: 'UNKNOWN_EXCEPTION_TYPE',
                message: '',
                body: null,
            };

            const result = ExceptionService.handleException(exception, translateMock);

            expect(result.message).toBe(unexpectedErrorMessage);
        });
    });

    describe('translateExceptionType', () => {
        it('should return the correct translation for DefaultExceptionType.UNAUTHORIZED', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.UNAUTHORIZED, translateMock);
            expect(result).toBe(unauthorizedActionMessage);
        });

        it('should return the correct translation for DefaultExceptionType.FORBIDDEN', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.FORBIDDEN, translateMock);
            expect(result).toBe(unauthorizedActionMessage);
        });

        it('should return the correct translation for DefaultExceptionType.REQUIRE_SUBSCRIPTION', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.REQUIRE_SUBSCRIPTION, translateMock);
            expect(result).toBe(subscriptionRequiredMessage);
        });

        it('should return the correct translation for DefaultExceptionType.NOT_FOUND', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.NOT_FOUND, translateMock);
            expect(result).toBe(resourceNotFoundMessage);
        });

        it('should return the correct translation for DefaultExceptionType.BAD_REQUEST', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.BAD_REQUEST, translateMock);
            expect(result).toBe(invalidInfosMessage);
        });

        it('should return the correct translation for DefaultExceptionType.CONFLICT', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.CONFLICT, translateMock);
            expect(result).toBe(conflictEncounteredMessage);
        });

        it('should return the correct translation for DefaultExceptionType.CONFLICT', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.CONFLICT, translateMock);
            expect(result).toBe(conflictEncounteredMessage);
        });

        it('should return the correct translation for DefaultExceptionType.EXTERNAL_RESOURCE_UNAVAILABLE', () => {
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.EXTERNAL_RESOURCE_UNAVAILABLE, translateMock);
            expect(result).toBe(externalResourceUnavailableMessage);
        });

        it('should return the custom translation if customTranslateException is provided and returns a value', () => {
            const customErrorMessage = 'Custom error message';
            const customTranslateException = jest.fn(() => customErrorMessage);
            const result = ExceptionService.translateExceptionType('CUSTOM_ERROR', translateMock, customTranslateException);
            expect(result).toBe(customErrorMessage);
        });

        it('should return the default translation if customTranslateException is provided but returns null', () => {
            const customTranslateException = jest.fn(() => null);
            const result = ExceptionService.translateExceptionType(DefaultExceptionType.UNKNOWN_ERROR, translateMock, customTranslateException);
            expect(result).toBe(unexpectedErrorMessage);
        });

        it('should return the default translation for unknown exception types', () => {
            const result = ExceptionService.translateExceptionType('UNKNOWN_EXCEPTION_TYPE', translateMock);
            expect(result).toBe(unexpectedErrorMessage);
        });
    });
});
