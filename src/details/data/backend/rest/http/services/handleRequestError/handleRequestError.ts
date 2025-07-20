import { HttpException } from 'http-repository-cache';
import MapperHttpExceptionToException from '../../mapperHttpExceptionToException/MapperHttpExceptionToException';

const handleRequestError = <T, B>(httpException: HttpException<T, B>) => {
  throw new MapperHttpExceptionToException().map(httpException);
}

export default handleRequestError;
