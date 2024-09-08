import authGuard from "core/user/auth/guards/authGuard/authGuard";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import HttpRequestAdapter, { HttpRequestParams } from "core/httpRequest/HttpRequestAdapter";
import DefaultExceptionTypes from "core/exceptions/DefaultExceptionTypes";

export interface FetchRequestOptions extends Omit<RequestInit, "method" | "headers" | "body"> { }

export default class FetchHttpRequestAdapter implements HttpRequestAdapter<FetchRequestOptions> {
  constructor(private sessionStorageService: SessionStorageService) { }

  private getAuthorizationHeader() {
    return (
      authGuard(this.sessionStorageService) && {
        Authorisation: `Bearer ${this.sessionStorageService.token}`,
      }
    );
  }

  private getHeaders(headers?: Record<string, string>, conteTypeJSON = true) {
    return {
      ...headers,
      ...(conteTypeJSON && { "Content-Type": "application/json" }),
      ...this.getAuthorizationHeader(),
    };
  }

  /**
   * Create exception based on status code
   * @param status 
   * @param body 
   */
  private generateException = (status: number, body?: unknown) => {
    switch (status) {
      case 400:
        throw {
          type: DefaultExceptionTypes.BAD_REQUEST,
          body
        };
      case 401:
        throw {
          type: DefaultExceptionTypes.UNAUTHORIZED,
          body
        };
      case 402:
        throw {
          type: DefaultExceptionTypes.REQUIRE_SUBSCRIPTION,
          body
        };
      case 403:
        throw {
          type: DefaultExceptionTypes.FORBIDDEN,
          body
        };
      case 404:
        throw {
          type: DefaultExceptionTypes.NOT_FOUND,
          body
        };
      case 409:
        throw {
          type: DefaultExceptionTypes.CONFLICT,
          body
        };
      case 500:
        throw {
          type: DefaultExceptionTypes.SERVER_ERROR,
          body
        };
      case 503:
        throw {
          type: DefaultExceptionTypes.SERVER_UNAVAILABLE,
          body
        };
      default:
        throw {
          type: DefaultExceptionTypes.UNKNOWN_ERROR,
          body
        };
    }
  }

  private handleResponseCallback<R, E>(successStatusCodes: number[]) {
    const defaultSuccessStatusCodes = [200, 201, 204];

    return async (response: Response) => {
      const body: R | E = await response.json();

      if (defaultSuccessStatusCodes.includes(response.status) || successStatusCodes.includes(response.status)) {
        return body as R
      }

      //if not a success response throw Exception
      throw this.generateException(response.status, body)
    }
  }

  /**
   * Handle the error response of requests.
   * Handle the abort error and throw a custom exception with status code 5000
   * 
   * @param error 
   */
  private handleError = async (response: unknown) => {
    if ((response as Error).name === "AbortError") {
      throw {
        type: DefaultExceptionTypes.ABORT_REQUEST,
      };
    }
    throw response;
  }

  get<R, E>(httpRequestParams: HttpRequestParams<never, FetchRequestOptions>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "GET",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      ...httpRequestParams.options
    }).then(this.handleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? [])).catch(this.handleError);
  }

  post<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B, FetchRequestOptions>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "POST",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      body: JSON.stringify(httpRequestParams.body),
      ...httpRequestParams.options
    }).then(this.handleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? [])).catch(this.handleError);
  }

  patch<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B, FetchRequestOptions>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "PATCH",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      body: JSON.stringify(httpRequestParams.body),
      ...httpRequestParams.options
    }).then(this.handleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? [])).catch(this.handleError);
  }

  put<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B, FetchRequestOptions>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "PUT",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      body: JSON.stringify(httpRequestParams.body),
      ...httpRequestParams.options
    }).then(this.handleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? [])).catch(this.handleError);
  }

  delete<R, E>(httpRequestParams: HttpRequestParams<never, FetchRequestOptions>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "DELETE",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      ...httpRequestParams.options
    }).then(this.handleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? [])).catch(this.handleError);
  }
}
