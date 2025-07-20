import NavCollapsedRepository from "core/theme/NavCollapsedRepository";
import LocalStorageNavCollapsedRepository from "details/storage/localStorage/repositories/localStorageNavCollapsedRepository/LocalStorageNavCollapsedRepository";

const navCollapsedRepository: NavCollapsedRepository =  new LocalStorageNavCollapsedRepository();

export default navCollapsedRepository;