import { DefaultHttpExceptionType, HttpException } from "http-repository-cache";
import DefaultExceptionType from "core/exceptions/DefaultExceptionType";
import MapperHttpExceptionToException from "./MapperHttpExceptionToException";

describe("MapperHttpExceptionToException", () => {
    let mapper: MapperHttpExceptionToException;

    beforeEach(() => {
        mapper = new MapperHttpExceptionToException();
    });

    it("should map UNAUTHORIZED HttpException to UNAUTHORIZED Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.UNAUTHORIZED,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.UNAUTHORIZED,
            body: null,
        });
    });

    it("should map FORBIDDEN HttpException to FORBIDDEN Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.FORBIDDEN,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.FORBIDDEN,
            body: null,
        });
    });

    it("should map PAYMENT_REQUIRED HttpException to REQUIRE_SUBSCRIPTION Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.PAYMENT_REQUIRED,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.REQUIRE_SUBSCRIPTION,
            body: null,
        });
    });

    it("should map NOT_FOUND HttpException to NOT_FOUND Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.NOT_FOUND,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.NOT_FOUND,
            body: null,
        });
    });

    it("should map BAD_REQUEST HttpException to BAD_REQUEST Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.BAD_REQUEST,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.BAD_REQUEST,
            body: null,
        });
    });

    it("should map CONFLICT HttpException to CONFLICT Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.CONFLICT,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.CONFLICT,
            body: null,
        });
    });

    it("should map ABORT_REQUEST HttpException to ABORT_REQUEST Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.ABORT_REQUEST,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.ABORT_REQUEST,
            body: null,
        });
    });

    it("should map SERVER_UNAVAILABLE HttpException to EXTERNAL_RESOURCE_UNAVAILABLE Exception", () => {
        const httpException: HttpException<null, null> = {
            type: DefaultHttpExceptionType.SERVER_UNAVAILABLE,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.EXTERNAL_RESOURCE_UNAVAILABLE,
            body: null,
        });
    });

    it("should map unknown HttpException to UNEXPECTED_ERROR Exception", () => {
        const httpException: HttpException<null, null> = {
            type: "UNKNOWN_TYPE" as DefaultHttpExceptionType,
            body: null,
        };

        const result = mapper.map(httpException);

        expect(result).toEqual({
            type: DefaultExceptionType.UNEXPECTED_ERROR,
            body: null,
        });
    });
});