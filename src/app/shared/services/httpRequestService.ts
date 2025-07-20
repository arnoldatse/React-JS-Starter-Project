import SessionStorageService from "core/authUser/auth/services/sessionStorageService/SessionStorageService";
import HttpRequestAdapter from "core/httpRequest/HttpRequestAdapter";
import FetchHttpRequestAdapter from "details/httpRequest/fetch/FetchHttpRequestAdapter";
import LocalStorageAuthDatasRepository from "details/storage/localStorage/repositories/localStorageAuthDatasRepository/LocalStorageAuthDatasRepository";

const httpRequestService: HttpRequestAdapter = new FetchHttpRequestAdapter(SessionStorageService.getInstance(new LocalStorageAuthDatasRepository()));

export default httpRequestService;