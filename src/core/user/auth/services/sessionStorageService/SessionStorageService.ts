import StoreAuthDatasRepository from "../../repositories/StoreAuthDatasRepository";
import AuthDatas from "../../entities/AuthDatas";

export default class SessionStorageService {
  private static instance: SessionStorageService;
  private _authDatas: AuthDatas | null = null;
  private _persist = true;

  private constructor(private storeAuthDatasRepository: StoreAuthDatasRepository) {
    this.initauthDatas();
  }

  public static getInstance(storeAuthDatasRepository: StoreAuthDatasRepository, newInstance = false) {
    if (!this.instance || newInstance) {
      SessionStorageService.instance =
        new SessionStorageService(storeAuthDatasRepository);
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
    if (this._persist) {
      try {
        await this.storeAuthDatasRepository.save(authDatas);
      }
      catch (error) {
        console.error("Failed to save authentication datas", error);
      }
    }
    this._authDatas = authDatas;
  }
  async remove() {
    if (this._persist) {
      try {
        await this.storeAuthDatasRepository.remove();
      }
      catch (error) {
        console.error("Failed to remove authentication datas", error);
      }
    }
    this._authDatas = null;
  }
}