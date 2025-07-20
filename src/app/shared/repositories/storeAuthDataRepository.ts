import StoreAuthDataRepository from "core/authUser/auth/repositories/StoreAuthDataRepository";
import LocalStorageAuthDataRepository from "details/storage/localStorage/repositories/localStorageAuthDataRepository/LocalStorageAuthDataRepository";

const storeAuthDataRepository: StoreAuthDataRepository = new LocalStorageAuthDataRepository();

export default storeAuthDataRepository;