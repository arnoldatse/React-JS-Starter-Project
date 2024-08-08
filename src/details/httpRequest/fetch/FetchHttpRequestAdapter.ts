import authGuard from "core/user/auth/guards/authGuard/authGuard";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import HttpRequestAdapter, { HttpRequestParams, HttpResponseException } from "core/httpRequest/HttpRequestAdapter";

export default class FetchHttpRequestAdapter implements HttpRequestAdapter {
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

  private getHandleResponseCallback<R, E>(successStatusCodes: number[]) {
    const defaultSuccessStatusCodes = [200, 201, 204];

    return async (response: Response) => {
      const body: R | E = await response.json();

      if (defaultSuccessStatusCodes.includes(response.status) || successStatusCodes.includes(response.status)) {
        return body as R
      }

      //if not a success response throw HttpResponseException
      const bodyException = body as E;
      const requestException: HttpResponseException<E> = {
        status: response.status,
        body: bodyException,
      }
      throw requestException
    }
  }

  get<R, E>(httpRequestParams: HttpRequestParams): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "GET",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
    }).then(this.getHandleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? []));
  }

  post<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "POST",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      body: JSON.stringify(httpRequestParams.body),
    }).then(this.getHandleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? []));
  }

  put<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "PUT",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      body: JSON.stringify(httpRequestParams.body),
    }).then(this.getHandleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? []));
  }

  patch<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B>): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "PATCH",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
      body: JSON.stringify(httpRequestParams.body),
    }).then(this.getHandleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? []));
  }

  delete<R, E>(httpRequestParams: HttpRequestParams): Promise<R> {
    return fetch(httpRequestParams.url, {
      method: "DELETE",
      headers: this.getHeaders(httpRequestParams.headers, httpRequestParams.contentTypeJSON ?? true),
    }).then(this.getHandleResponseCallback<R, E>(httpRequestParams.successStatusCodes ?? []));
  }
}
