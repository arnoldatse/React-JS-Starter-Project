import StoreAuthDatasRepository from 'core/user/auth/repositories/StoreAuthDatasRepository';
import FetchHttpRequestAdapter from './FetchHttpRequestAdapter';
import SessionStorageService from 'core/user/auth/services/sessionStorageService/SessionStorageService';
import DefaultExceptionTypes from 'core/exceptions/DefaultExceptionTypes';

describe('FetchHttpRequestAdapter', () => {
    let fetchHttpRequestAdapter: FetchHttpRequestAdapter;
    let sessionStorageService: SessionStorageService;

    let sessionStorageService_spy_isAuthenticated: jest.SpyInstance;
    let sessionStorageService_spy_token: jest.SpyInstance;

    beforeEach(() => {
        global.fetch = jest.fn();
        const storeAuthDatasRepository: jest.Mocked<StoreAuthDatasRepository> = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn(),
        }
        sessionStorageService = SessionStorageService.getInstance(storeAuthDatasRepository);
        fetchHttpRequestAdapter = new FetchHttpRequestAdapter(sessionStorageService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('GET request', () => {
        it('should successfully perform a GET request', async () => {
            const mockResponse = { "data": 'test data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.get({ url: 'http://test.com' });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'GET', headers: { "Content-Type": "application/json" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        it('should successfully perform a GET request as authenticated', async () => {
            const mockResponse = { "data": 'test data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue('token');

            const response = await fetchHttpRequestAdapter.get({ url: 'http://test.com' });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'GET', headers: { "Content-Type": "application/json", Authorisation: "Bearer token" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).toHaveBeenCalled();
        });

        it('should successfully perform a GET request zith extra headers', async () => {
            const mockResponse = { "data": 'test data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.get({ url: 'http://test.com', headers: { Accept: 'image/*' } });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'GET', headers: { "Content-Type": "application/json", Accept: "image/*" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        describe('should throw an error on a failed GET request', () => {
            it('should throw an exception with BAD REAUEST type on a failed GET request with 400 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 400,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.BAD_REQUEST,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNAUTHORIZED type on a failed GET request with 401 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 401,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNAUTHORIZED,
                    body: mockResponse,
                });
            });
            it('should throw an exception with REQUIRE SUBSCRIPTION type on a failed GET request with 402 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 402,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.REQUIRE_SUBSCRIPTION,
                    body: mockResponse,
                });
            });
            it('should throw an exception with FORBIDDEN type on a failed GET request with 403 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 403,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.FORBIDDEN,
                    body: mockResponse,
                });
            });
            it('should throw an exception with NOT FOUND type on a failed GET request with 404 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.NOT_FOUND,
                    body: mockResponse,
                });
            });
            it('should throw an exception with CONFLICT type on a failed GET request with 409 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.CONFLICT,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER ERROR type on a failed GET request with 500 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 500,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER UNAVAILABLE type on a failed GET request with 503 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 503,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_UNAVAILABLE,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNKNOWN ERROR type on a failed GET request with any other code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 300,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNKNOWN_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with ABORT REQUEST type on a failed GET request with AbortError', async () => {
                const error = new Error();
                error.name = "AbortError";
                (global.fetch as jest.Mock).mockRejectedValue(error);

                await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.ABORT_REQUEST,
                });
            });
        });
    });

    describe('POST request', () => {
        it('should successfully perform a POST request', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.post({ url: 'http://test.com', body });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'POST', body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        it('should successfully perform a GET request as authenticated', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue('token');

            const response = await fetchHttpRequestAdapter.post({ url: 'http://test.com', body });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'POST', body: JSON.stringify(body), headers: { "Content-Type": "application/json", Authorisation: "Bearer token" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).toHaveBeenCalled();
        });

        it('should successfully perform a GET request zith extra headers', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.post({ url: 'http://test.com', body, headers: { Accept: 'image/*' } });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'POST', body: JSON.stringify(body), headers: { "Content-Type": "application/json", Accept: "image/*" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        describe('should throw an error on a failed POST request', () => {
            it('should throw an exception with BAD REAUEST type on a failed POST request with 400 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 400,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.BAD_REQUEST,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNAUTHORIZED type on a failed POST request with 401 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 401,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNAUTHORIZED,
                    body: mockResponse,
                });
            });
            it('should throw an exception with REQUIRE SUBSCRIPTION type on a failed POST request with 402 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 402,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.REQUIRE_SUBSCRIPTION,
                    body: mockResponse,
                });
            });
            it('should throw an exception with FORBIDDEN type on a failed POST request with 403 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 403,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.FORBIDDEN,
                    body: mockResponse,
                });
            });
            it('should throw an exception with NOT FOUND type on a failed POST request with 404 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.NOT_FOUND,
                    body: mockResponse,
                });
            });
            it('should throw an exception with CONFLICT type on a failed POST request with 409 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.CONFLICT,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER ERROR type on a failed POST request with 500 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 500,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER UNAVAILABLE type on a failed POST request with 503 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 503,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_UNAVAILABLE,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNKNOWN ERROR type on a failed POST request with any other code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 300,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNKNOWN_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with ABORT REQUEST type on a failed POST request with AbortError', async () => {
                const error = new Error();
                error.name = "AbortError";
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockRejectedValue(error);

                await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.ABORT_REQUEST,
                });
            });
        });
    });

    describe('PUT request', () => {
        it('should successfully perform a PUT request', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.put({ url: 'http://test.com', body });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'PUT', body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        it('should successfully perform a PUT request as authenticated', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue('token');

            const response = await fetchHttpRequestAdapter.put({ url: 'http://test.com', body });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'PUT', body: JSON.stringify(body), headers: { "Content-Type": "application/json", Authorisation: "Bearer token" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).toHaveBeenCalled();
        });

        it('should successfully perform a PUT request zith extra headers', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.put({ url: 'http://test.com', body, headers: { Accept: 'image/*' } });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'PUT', body: JSON.stringify(body), headers: { "Content-Type": "application/json", Accept: "image/*" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        describe('should throw an error on a failed PUT request', () => {
            it('should throw an exception with BAD REAUEST type on a failed PUT request with 400 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 400,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.BAD_REQUEST,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNAUTHORIZED type on a failed PUT request with 401 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 401,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNAUTHORIZED,
                    body: mockResponse,
                });
            });
            it('should throw an exception with REQUIRE SUBSCRIPTION type on a failed PUT request with 402 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 402,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.REQUIRE_SUBSCRIPTION,
                    body: mockResponse,
                });
            });
            it('should throw an exception with FORBIDDEN type on a failed PUT request with 403 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 403,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.FORBIDDEN,
                    body: mockResponse,
                });
            });
            it('should throw an exception with NOT FOUND type on a failed PUT request with 404 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.NOT_FOUND,
                    body: mockResponse,
                });
            });
            it('should throw an exception with CONFLICT type on a failed PUT request with 409 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.CONFLICT,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER ERROR type on a failed PUT request with 500 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 500,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER UNAVAILABLE type on a failed PUT request with 503 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 503,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_UNAVAILABLE,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNKNOWN ERROR type on a failed PUT request with any other code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 300,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNKNOWN_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with ABORT REQUEST type on a failed PUT request with AbortError', async () => {
                const error = new Error();
                error.name = "AbortError";
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockRejectedValue(error);

                await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.ABORT_REQUEST,
                });
            });
        });
    });

    describe('PATCH request', () => {
        it('should successfully perform a PATCH request', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.patch({ url: 'http://test.com', body });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'PATCH', body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        it('should successfully perform a PATCH request as authenticated', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue('token');

            const response = await fetchHttpRequestAdapter.patch({ url: 'http://test.com', body });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'PATCH', body: JSON.stringify(body), headers: { "Content-Type": "application/json", Authorisation: "Bearer token" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).toHaveBeenCalled();
        });

        it('should successfully perform a PATCH request zith extra headers', async () => {
            const mockResponse = { "data": 'test data' };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.patch({ url: 'http://test.com', body, headers: { Accept: 'image/*' } });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'PATCH', body: JSON.stringify(body), headers: { "Content-Type": "application/json", Accept: "image/*" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });
        
        describe('should throw an error on a failed PATCH request', () => {
            it('should throw an exception with BAD REAUEST type on a failed PATCH request with 400 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 400,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.BAD_REQUEST,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNAUTHORIZED type on a failed PATCH request with 401 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 401,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNAUTHORIZED,
                    body: mockResponse,
                });
            });
            it('should throw an exception with REQUIRE SUBSCRIPTION type on a failed PATCH request with 402 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 402,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.REQUIRE_SUBSCRIPTION,
                    body: mockResponse,
                });
            });
            it('should throw an exception with FORBIDDEN type on a failed PATCH request with 403 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 403,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.FORBIDDEN,
                    body: mockResponse,
                });
            });
            it('should throw an exception with NOT FOUND type on a failed PATCH request with 404 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.NOT_FOUND,
                    body: mockResponse,
                });
            });
            it('should throw an exception with CONFLICT type on a failed PATCH request with 409 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.CONFLICT,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER ERROR type on a failed PATCH request with 500 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 500,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });
                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER UNAVAILABLE type on a failed PATCH request with 503 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 503,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_UNAVAILABLE,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNKNOWN ERROR type on a failed PATCH request with any other code status', async () => {
                const mockResponse = { "error": "Not Found" };
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 300,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNKNOWN_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with ABORT REQUEST type on a failed PATCH request with AbortError', async () => {
                const error = new Error();
                error.name = "AbortError";
                const body = { requestData: 'test request data' };
                (global.fetch as jest.Mock).mockRejectedValue(error);

                await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                    type: DefaultExceptionTypes.ABORT_REQUEST,
                });
            });
        });
    });

    describe('DELETE request', () => {
        it('should successfully perform a DELETE request', async () => {
            const mockResponse = { "data": 'test data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.delete({ url: 'http://test.com' });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'DELETE', headers: { "Content-Type": "application/json" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });

        it('should successfully perform a DELETE request as authenticated', async () => {
            const mockResponse = { "data": 'test data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue('token');

            const response = await fetchHttpRequestAdapter.delete({ url: 'http://test.com' });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'DELETE', headers: { "Content-Type": "application/json", Authorisation: "Bearer token" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).toHaveBeenCalled();
        });

        it('should successfully perform a DELETE request zith extra headers', async () => {
            const mockResponse = { "data": 'test data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);
            sessionStorageService_spy_token = jest.spyOn(sessionStorageService, 'token', 'get').mockReturnValue(null);

            const response = await fetchHttpRequestAdapter.delete({ url: 'http://test.com', headers: { Accept: 'image/*' } });

            expect(global.fetch).toHaveBeenCalledWith('http://test.com', { method: 'DELETE', headers: { "Content-Type": "application/json", Accept: "image/*" } });
            expect(response).toEqual(mockResponse);
            expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
            expect(sessionStorageService_spy_token).not.toHaveBeenCalled();
        });


        describe('should throw an error on a failed DELETE request', () => {
            it('should throw an exception with BAD REAUEST type on a failed DELETE request with 400 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 400,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.BAD_REQUEST,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNAUTHORIZED type on a failed DELETE request with 401 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 401,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNAUTHORIZED,
                    body: mockResponse,
                });
            });
            it('should throw an exception with REQUIRE SUBSCRIPTION type on a failed DELETE request with 402 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 402,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.REQUIRE_SUBSCRIPTION,
                    body: mockResponse,
                });
            });
            it('should throw an exception with FORBIDDEN type on a failed DELETE request with 403 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 403,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.FORBIDDEN,
                    body: mockResponse,
                });
            });
            it('should throw an exception with NOT FOUND type on a failed DELETE request with 404 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 404,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.NOT_FOUND,
                    body: mockResponse,
                });
            });
            it('should throw an exception with CONFLICT type on a failed DELETE request with 409 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.CONFLICT,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER ERROR type on a failed DELETE request with 500 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 500,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with SERVER UNAVAILABLE type on a failed DELETE request with 503 code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 503,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.SERVER_UNAVAILABLE,
                    body: mockResponse,
                });
            });
            it('should throw an exception with UNKNOWN ERROR type on a failed DELETE request with any other code status', async () => {
                const mockResponse = { "error": "Not Found" };
                (global.fetch as jest.Mock).mockResolvedValue({
                    ok: false,
                    status: 300,
                    json: jest.fn().mockResolvedValue(mockResponse),
                });

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.UNKNOWN_ERROR,
                    body: mockResponse,
                });
            });
            it('should throw an exception with ABORT REQUEST type on a failed DELETE request with AbortError', async () => {
                const error = new Error();
                error.name = "AbortError";
                (global.fetch as jest.Mock).mockRejectedValue(error);

                await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                    type: DefaultExceptionTypes.ABORT_REQUEST,
                });
            });
        });
    });
});