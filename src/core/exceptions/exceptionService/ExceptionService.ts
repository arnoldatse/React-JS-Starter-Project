import StringsKey from "core/internationalization/strings/StringsKey";
import Exception from "../Exception";
import DefaultExceptionType from "../DefaultExceptionType";
import Logger from "core/log/Logger";

type CustomExceptionType<T = unknown> = DefaultExceptionType | T;

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
     * @param {(key: StringsKey) => string} translate - The translation function to translate the exception message.
     * @param {(exceptionType: CustomExceptionType<T>) => string | null} [customTranslateException] - The optional function to translate custom exception types.
     * @returns {Exception<B, T>} - The updated exception object with the translated message.
     */
    static handleException<B = unknown, T = unknown>(
        exception: Exception<B, T>,
        translate: (key: StringsKey) => string,
        customTranslateException?: (exceptionType: CustomExceptionType<T>) => string | null,
    ): Exception<B, T> {
        const myException = {
            ...exception,
            ...(!exception.body && !exception.type && { body: exception as unknown as B }),
            message: ExceptionService.translateExceptionType(
                exception.type,
                translate,
                customTranslateException
            ),
        }

        Logger.getInstance().log(myException, "ExceptionService.handleException", true);

        return myException
    }

    /**
     * Translates the given exception type to a corresponding error message using the provided translation function.
     *
     * @template T - The type of the exception.
     * @param {DefaultExceptionType | T} exceptionType - The exception type to translate.
     * @param {(key: StringsKey) => string} translate - The translation function to use.
     * @param {(unknownException: CustomExceptionType<T>) => string | null} [customTranslateException] - An optional custom translation function for handling unknown exceptions.
     * @returns {string} - The translated error message.
     */
    static translateExceptionType<T = unknown>(
        exceptionType: DefaultExceptionType | T,
        translate: (key: StringsKey) => string,
        customTranslateException?: (unknownException: CustomExceptionType<T>) => string | null
    ): string {
        let exceptionMessage: string | null = null;
        if (customTranslateException) {
            exceptionMessage = customTranslateException(exceptionType);
            if (exceptionMessage) return exceptionMessage;
        }

        switch (exceptionType) {
            case DefaultExceptionType.UNAUTHORIZED:
            case DefaultExceptionType.FORBIDDEN:
                return translate(StringsKey.unauthorizedAction);

            case DefaultExceptionType.REQUIRE_SUBSCRIPTION:
                return translate(StringsKey.subscriptionRequired);

            case DefaultExceptionType.NOT_FOUND:
                return translate(StringsKey.resourceNotFound);

            case DefaultExceptionType.BAD_REQUEST:
                return translate(StringsKey.invalidInfos);

            case DefaultExceptionType.CONFLICT:
                return translate(StringsKey.conflictEncountered);

            case DefaultExceptionType.EXTERNAL_RESOURCE_UNAVAILABLE:
                return translate(StringsKey.externalResourceUnavailable);

            case DefaultExceptionType.UNEXPECTED_ERROR:
                return translate(StringsKey.unexpectedError);
            default:
                return translate(StringsKey.unexpectedError);
        }
    }
}
