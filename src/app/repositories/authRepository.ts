import httpRequestService from "app/services/httpRequestService";
import AuthRepositoryBackend from "details/datas/backend/rest/repositories/AuthRepositoryBackend/AuthRepositoryBackend";

const authRepository = new AuthRepositoryBackend(httpRequestService);

export default authRepository;