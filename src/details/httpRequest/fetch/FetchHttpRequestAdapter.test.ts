import StoreAuthDatasRepository from 'core/user/auth/repositories/StoreAuthDatasRepository';
import FetchHttpRequestAdapter from './FetchHttpRequestAdapter';
import SessionStorageService from 'core/user/auth/services/sessionStorageService/SessionStorageService';

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
        sessionStorageService = SessionStorageService.getInstance(storeAuthDatasRepository, true);
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

        it('should throw an error on a failed GET request', async () => {
            const mockResponse = { "error": "Not Found" };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            await expect(fetchHttpRequestAdapter.get({ url: 'http://test.com' })).rejects.toEqual({
                status: 404,
                body: mockResponse,
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

        it('should throw an error on a failed GET request', async () => {
            const mockResponse = { "error": "Not Found" };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            await expect(fetchHttpRequestAdapter.post({ url: 'http://test.com', body })).rejects.toEqual({
                status: 404,
                body: mockResponse,
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

        it('should throw an error on a failed PUT request', async () => {
            const mockResponse = { "error": "Not Found" };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            await expect(fetchHttpRequestAdapter.put({ url: 'http://test.com', body })).rejects.toEqual({
                status: 404,
                body: mockResponse,
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

        it('should throw an error on a failed PATCH request', async () => {
            const mockResponse = { "error": "Not Found" };
            const body = { requestData: 'test request data' };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            await expect(fetchHttpRequestAdapter.patch({ url: 'http://test.com', body })).rejects.toEqual({
                status: 404,
                body: mockResponse,
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

        it('should throw an error on a failed DELETE request', async () => {
            const mockResponse = { "error": "Not Found" };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            await expect(fetchHttpRequestAdapter.delete({ url: 'http://test.com' })).rejects.toEqual({
                status: 404,
                body: mockResponse,
            });
        });
    });
});