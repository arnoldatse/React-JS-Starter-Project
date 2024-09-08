/**
 * @template T - request body type
 * @template O - request options type
 */
export interface HttpRequestParams<T = unknown, O = unknown> {
    url: string;
    body?: T;
    headers?: Record<string, string>;
    successStatusCodes?: number[];
    contentTypeJSON?: boolean;
    options?: O;
}

export default interface HttpRequestAdapter<O = unknown> {
    /**
     * get request
     * @param url 
     * @param headers 
     * @template R - response body type
     * @template E - Exception body type
     * @returns 
     */
    get<R, E>(httpRequestParams: HttpRequestParams<never, O>): Promise<R>;
    /**
     * post request
     * @param url 
     * @param body 
     * @param headers 
     * @template R - response body type
     * @template E - Exception body type
     * @template B - request body type
     * @returns
     * 
     */
    post<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B, O>): Promise<R>;
    /**
     * post request
     * @param url 
     * @param body 
     * @param headers 
     * @template R - response body type
     * @template E - Exception body type
     * @template B - request body type
     * @returns 
     */
    patch<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B, O>): Promise<R>;
    /**
     * put request
     * @param url 
     * @param body 
     * @param headers 
     * @template R - response body type
     * @template E - Exception body type
     * @template B - request body type
     * @returns 
     */
    put<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B, O>): Promise<R>;
    /**
     * delete request
     * @param url 
     * @param headers 
     * @template R - response body type
     * @template E - Exception body type
     * @returns 
     */
    delete<R, E>(httpRequestParams: HttpRequestParams<never, O>): Promise<R>;
}