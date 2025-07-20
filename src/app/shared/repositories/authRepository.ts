import AuthRepository from "core/authUser/auth/repositories/AuthRepository";
import FakeAuthRepositoryBackend from "details/data/backend/rest/mock/FakeAuthRepositoryBackend";

const authRepository: AuthRepository = new FakeAuthRepositoryBackend();

export default authRepository;