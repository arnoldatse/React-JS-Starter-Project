import StoreAuthDataRepository from "../../repositories/StoreAuthDataRepository";
import AuthData from "../../entities/AuthData";
import SessionStorageExceptionTypes from "../../exceptions/SessionStorageExceptionType";
import Logger from "core/log/Logger";
import Exception from "@/core/exceptions/Exception";

export default class SessionStorageService {
  private static instance: SessionStorageService;
  private _authData: AuthData | null = null;
  private _persist = true;

  private constructor(private readonly storeAuthDataRepository: StoreAuthDataRepository) {
    this.initAuthData();
  }

  public static getInstance(storeAuthDataRepository?: StoreAuthDataRepository) {
    if (storeAuthDataRepository) {
      SessionStorageService.instance =
        new SessionStorageService(storeAuthDataRepository);
    }
    else if (!storeAuthDataRepository && !this.instance) {
      Logger.getInstance().log(new Error("StoreAuthDataRepository is required to create a new instance"), "SessionStorageService.getInstance");
      throw { type: SessionStorageExceptionTypes.STORE_AUTH_DATA_REPOSITORY_REQUIRED };
    }
    return this.instance;
  }

  enablePersist() {
    this._persist = true;
  }

  disablePersist() {
    this._persist = false;
  }

  get persist() {
    return this._persist;
  }

  get isAuthenticated() {
    return !!this.token;
  }

  get token() {
    return this.authData?.token ?? null;
  }

  get authData() {
    return this._authData;
  }

  private async initAuthData() {
    if (!this._authData && this._persist) {
      try {
        const authenticatedData = await this.storeAuthDataRepository.get();
        if (authenticatedData) {
          this._authData = authenticatedData;
        }
      }
      catch (error) {
        Logger.getInstance().log(error, "SessionStorageService.initAuthData");
      }
    }
  }

  async save(authData: AuthData) {
    this._authData = authData;
    if (this._persist) {
      try {
        await this.storeAuthDataRepository.save(authData);
      }
      catch (error) {
        const exception: Exception<unknown, SessionStorageExceptionTypes> = {
          type: SessionStorageExceptionTypes.FAILED_TO_SAVE_AUTH_DATA,
          body: error,
        }

        Logger.getInstance().log(exception, "SessionStorageService.save");
        throw exception;
      }
    }
  }
  async remove() {
    this._authData = null;
    if (this._persist) {
      try {
        await this.storeAuthDataRepository.remove();
      }
      catch (error) {
        const exception: Exception<unknown, SessionStorageExceptionTypes> = {
          type: SessionStorageExceptionTypes.FAILED_TO_REMOVE_AUTH_DATA,
          body: error,
        };

        Logger.getInstance().log(exception, "SessionStorageService.save");
        throw exception;
      }
    }
  }
}