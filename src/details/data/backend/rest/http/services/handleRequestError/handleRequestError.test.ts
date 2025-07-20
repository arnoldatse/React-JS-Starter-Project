import { DefaultHttpExceptionType } from 'http-repository-cache';
import MapperHttpExceptionToException from '../../mapperHttpExceptionToException/MapperHttpExceptionToException';
import handleRequestError from './handleRequestError';
import DefaultExceptionType from 'core/exceptions/DefaultExceptionType';

jest.mock('../../mapperHttpExceptionToException/MapperHttpExceptionToException');

describe('handleRequestError', () => {
    it('should throw the mapped exception from MapperHttpExceptionToException', () => {
        const exceptionBody = {
            message: 'Unauthorized access',
        }
        const mockHttpException = {
            type: DefaultHttpExceptionType.UNAUTHORIZED,
            body: exceptionBody
        };
        const mockMappedException = {
            type: DefaultExceptionType.UNAUTHORIZED,
            body: exceptionBody,
        };
        const mapMock = jest.fn().mockImplementation(() => { throw mockMappedException });

        (MapperHttpExceptionToException as jest.Mock).mockImplementation(() => ({
            map: mapMock,
        }));
        try{
            handleRequestError(mockHttpException)
        }
        catch (e) {
            expect(e).toEqual(mockMappedException);
            expect(mapMock).toHaveBeenCalledWith(mockHttpException);
        }
    });
});
