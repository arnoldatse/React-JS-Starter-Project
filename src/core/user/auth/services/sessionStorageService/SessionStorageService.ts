import StoreAuthDatasRepository from "../../repositories/StoreAuthDatasRepository";
import AuthDatas from "../../entities/AuthDatas";
import logErrorHandler from "core/error/logErrorHandler";
import SessionStorageExceptionTypes from "../../exceptions/SessionStorageExceptionTypes";

export default class SessionStorageService {
  private static instance: SessionStorageService;
  private _authDatas: AuthDatas | null = null;
  private _persist = true;

  private constructor(private storeAuthDatasRepository: StoreAuthDatasRepository) {
    this.initauthDatas();
  }

  public static getInstance(storeAuthDatasRepository?: StoreAuthDatasRepository) {
    if (storeAuthDatasRepository) {
      SessionStorageService.instance =
        new SessionStorageService(storeAuthDatasRepository);
    }
    else if (!storeAuthDatasRepository && !this.instance) {
      logErrorHandler(new Error("StoreAuthDatasRepository is required to create a new instance"), "SessionStorageService.getInstance");
      throw { type: SessionStorageExceptionTypes.STORE_AUTH_DATAS_REPOSITORY_REQUIRED };
    }
    return this.instance;
  }

  setPersist() {
    this._persist = true;
  }

  setUnpersist() {
    this._persist = false;
  }

  get persist() {
    return this._persist;
  }

  get isAuthenticated() {
    return !!this.token;
  }

  get token() {
    return this.authDatas?.token ?? null;
  }

  get authDatas() {
    return this._authDatas;
  }

  private async initauthDatas() {
    if (!this._authDatas && this._persist) {
      try {
        const authenticatedDatas = await this.storeAuthDatasRepository.get();
        if (authenticatedDatas) {
          this._authDatas = authenticatedDatas;
        }
      }
      catch (error) {
        console.warn("Failed to get authentication datas", error);
      }
    }
  }

  async save(authDatas: AuthDatas) {
    this._authDatas = authDatas;
    if (this._persist) {
      try {
        await this.storeAuthDatasRepository.save(authDatas);
      }
      catch (error) {
        logErrorHandler(new Error("Failed to save authentication datas"), "SessionStorageService.save");
        throw { type: SessionStorageExceptionTypes.FAILED_TO_SAVE_AUTH_DATAS, body: error };
      }
    }
  }
  async remove() {
    this._authDatas = null;
    if (this._persist) {
      try {
        await this.storeAuthDatasRepository.remove();
      }
      catch (error) {
        logErrorHandler(new Error("Failed to remove authentication datas"), "SessionStorageService.save");
        throw { type: SessionStorageExceptionTypes.FAILED_TO_REMOVE_AUTH_DATAS, body: error };
      }
    }
  }
}