export interface HttpRequestParams<T = void> {
    url: string;
    body?: T;
    headers?: Record<string, string>;
    successStatusCodes?: number[];
    contentTypeJSON?: boolean;
}

export interface HttpResponseException<E> {
    status: number;
    body: E;
}

export default interface HttpRequestAdapter {
    /**
     * get request
     * @param url 
     * @param headers 
     * @returns 
     */
    get<R, E>(httpRequestParams: HttpRequestParams): Promise<R>;
    /**
     * post request
     * @param url 
     * @param body 
     * @param headers 
     * @returns 
     */
    post<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B>): Promise<R>;
    /**
     * post request
     * @param url 
     * @param body 
     * @param headers 
     * @returns 
     */
    patch<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B>): Promise<R>;
    /**
     * put request
     * @param url 
     * @param body 
     * @param headers 
     * @returns 
     */
    put<R, E, B = unknown>(httpRequestParams: HttpRequestParams<B>): Promise<R>;
    /**
     * delete request
     * @param url 
     * @param headers 
     * @returns 
     */
    delete<R, E>(httpRequestParams: HttpRequestParams): Promise<R>;
}