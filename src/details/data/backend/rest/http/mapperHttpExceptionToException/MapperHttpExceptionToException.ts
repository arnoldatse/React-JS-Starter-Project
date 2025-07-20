import { DefaultHttpExceptionType, HttpException } from "http-repository-cache";
import DefaultExceptionType from "core/exceptions/DefaultExceptionType";
import Exception from "core/exceptions/Exception";

export default class MapperHttpExceptionToException {
  map<T, B>(httpException: HttpException<T, B>): Exception<B, T> {
    switch (httpException.type) {
      case DefaultHttpExceptionType.UNAUTHORIZED:
        return { type: DefaultExceptionType.UNAUTHORIZED, body: httpException.body };
      case DefaultHttpExceptionType.FORBIDDEN:
        return { type: DefaultExceptionType.FORBIDDEN, body: httpException.body };
      case DefaultHttpExceptionType.PAYMENT_REQUIRED:
        return { type: DefaultExceptionType.REQUIRE_SUBSCRIPTION, body: httpException.body };
      case DefaultHttpExceptionType.NOT_FOUND:
        return { type: DefaultExceptionType.NOT_FOUND, body: httpException.body };
      case DefaultHttpExceptionType.BAD_REQUEST:
        return { type: DefaultExceptionType.BAD_REQUEST, body: httpException.body };
      case DefaultHttpExceptionType.CONFLICT:
        return { type: DefaultExceptionType.CONFLICT, body: httpException.body };
      case DefaultHttpExceptionType.ABORT_REQUEST:
        return { type: DefaultExceptionType.ABORT_REQUEST, body: httpException.body };
      case DefaultHttpExceptionType.SERVER_UNAVAILABLE:
        return { type: DefaultExceptionType.EXTERNAL_RESOURCE_UNAVAILABLE, body: httpException.body };
      default:
        return { type: DefaultExceptionType.UNEXPECTED_ERROR, body: httpException.body };
    }
  }
}
