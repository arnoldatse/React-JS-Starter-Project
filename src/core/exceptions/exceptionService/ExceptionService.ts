import StringsKeys from "core/internationalization/strings/StringsKeys";
import Exception from "../Exception";
import DefaultExceptionTypes from "../DefaultExceptionTypes";

type CustomExceptionType<T = unknown> = DefaultExceptionTypes | T;

/**
 * ExceptionService class provides methods for handling and translating exceptions.
 */
export default class ExceptionService {
    /**
     * Handles an exception and returns an updated exception object with a translated message.
     * 
     * @template B - The type of the body of the exception.
     * @template T - The type of the custom exception.
     * @param {Exception<B, T>} exception - The exception to handle.
     * @param {(key: StringsKeys) => string} translate - The translation function to translate the exception message.
     * @param {(exceptionType: CustomExceptionType<T>) => string | null} [customTranslateException] - The optional function to translate custom exception types.
     * @returns {Exception<B, T>} - The updated exception object with the translated message.
     */
    static handleException<B = unknown, T = unknown>(
        exception: Exception<B, T>,
        translate: (key: StringsKeys) => string,
        customTranslateException?: (exceptionType: CustomExceptionType<T>) => string | null
    ): Exception<B, T> {
        return {
            ...exception,
            message: ExceptionService.translateExceptionType(
                exception.type,
                translate,
                customTranslateException
            ),
        }
    }

    /**
     * Translates the given exception type to a corresponding error message using the provided translation function.
     * 
     * @template T - The type of the exception.
     * @param {DefaultExceptionTypes | T} exceptionType - The exception type to translate.
     * @param {(key: StringsKeys) => string} translate - The translation function to use.
     * @param {(unknownException: CustomExceptionType<T>) => string | null} [customTranslateException] - An optional custom translation function for handling unknown exceptions.
     * @returns {string} - The translated error message.
     */
    static translateExceptionType<T = unknown>(
        exceptionType: DefaultExceptionTypes | T,
        translate: (key: StringsKeys) => string,
        customTranslateException?: (unknownException: CustomExceptionType<T>) => string | null
    ): string {
        let exceptionMessage: string | null = null;
        if (customTranslateException) {
            exceptionMessage = customTranslateException(exceptionType);
            if (exceptionMessage) return exceptionMessage;
        }

        switch (exceptionType) {
            case DefaultExceptionTypes.UNAUTHORIZED:
            case DefaultExceptionTypes.FORBIDDEN:
                return translate(StringsKeys.unauthorizedAction);

            case DefaultExceptionTypes.REQUIRE_SUBSCRIPTION:
                return translate(StringsKeys.subscriptionRequired);

            case DefaultExceptionTypes.NOT_FOUND:
                return translate(StringsKeys.resourceNotFound);

            case DefaultExceptionTypes.BAD_REQUEST:
                return translate(StringsKeys.invalidInfos);

            case DefaultExceptionTypes.CONFLICT:
                return translate(StringsKeys.conflictEncountered);

            case DefaultExceptionTypes.SERVER_UNAVAILABLE:
                return translate(StringsKeys.unavailableServer);

            case DefaultExceptionTypes.UNKNOWN_ERROR:
            case DefaultExceptionTypes.SERVER_ERROR:
                return translate(StringsKeys.unexpectedOrNetworkError);
            default:
                return translate(StringsKeys.unexpectedOrNetworkError);
        }
    }
}