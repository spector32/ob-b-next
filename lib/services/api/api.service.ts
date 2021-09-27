import { useState } from "react";
import getConfig from "next/config";
import { RecordModel } from "./models";
import getLocationOrigin from "../../helpers/getLocationOrigin";

const { publicRuntimeConfig } = getConfig();

class ApiService {
    static globals: Record<string, unknown> = {};
    static Services: ApiService[] = [];

    headers: Headers = new Headers();

    url: string = null;

    /** @constructor */
    constructor(childServiceName: string | null = null) {
        this.url = publicRuntimeConfig.apiUrl;
        this.headers = this.getDefaultHeaders();
        if (childServiceName && !(childServiceName in ApiService.Services)) {
            ApiService.Services[childServiceName] = this;
        }
    }

    /**
     * @description Handler for a HTTP GET request with `fetch`
     *
     * @param gateway Gateway on api url (e.g. http://.../api/v1/{gateway}).
     * @param params (optional) Parameters that wil be serialized and used in API url (e.g. {param1: 'value'} http://.../api/v1/{gateway}&param1=value).
     * @param overrideHeaders (optional) HTTP headers that will override default headers.
     *
     * @returns Response promise.
     */
    async get(
        gateway: string,
        params: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ): Promise<Response> {
        const url: string = this.url + gateway;
        const urlInstance: URL = this.resolveUrl(url);
        const searchParams: URLSearchParams = new URLSearchParams(urlInstance.search);
        if (params) {
            for (const key in params) {
                const value: string = (params[key] ?? "") as string;
                searchParams.set(key, value);
                // searchParams.append(key, value);
            }
            searchParams.sort();
            urlInstance.search = searchParams.toString();
        }

        return fetch(urlInstance.toString(), {
            ...this.getDefaultRequestParams(),
            method: "GET",
            headers: this.getDefaultHeaders(overrideHeaders),
        });
    }

    /**
     * @description Handler for a HTTP POST request with `fetch`
     *
     * @param gateway Gateway on api url (e.g. http://.../api/v1/{gateway}).
     * @param data (optional) Parameters that wil be serialized and used in a request.
     * @param overrideHeaders (optional) HTTP headers that will override default headers.
     *
     * @returns Response promise.
     */
    async post(
        gateway: string,
        data: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ): Promise<Response> {
        const url: string = this.url + gateway;
        const urlInstance: URL = this.resolveUrl(url);

        // console.log("urlInstance: ", urlInstance);

        // Default options are marked with *
        return fetch(urlInstance.toString(), {
            ...this.getDefaultRequestParams(),
            method: "POST",
            headers: this.getDefaultHeaders(overrideHeaders),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }

    /**
     * @description Handler for a HTTP PUT request with `fetch`
     *
     * @param gateway Gateway on api url (e.g. http://.../api/v1/{gateway}).
     * @param data (optional) Parameters that wil be serialized and used in a request.
     * @param overrideHeaders (optional) HTTP headers that will override default headers.
     *
     * @returns Response promise.
     */
    async put(
        gateway: string,
        data: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ): Promise<Response> {
        const url: string = this.url + gateway;
        const urlInstance: URL = this.resolveUrl(url);

        // console.log("urlInstance: ", urlInstance);

        // Default options are marked with *
        return fetch(urlInstance.toString(), {
            ...this.getDefaultRequestParams(),
            method: "PUT",
            headers: this.getDefaultHeaders(overrideHeaders),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }

    /**
     * @description Handler for a HTTP DELETE request with `fetch`
     *
     * @param gateway Gateway on api url (e.g. http://.../api/v1/{gateway}).
     * @param data (optional) Parameters that wil be serialized and used in a request.
     * @param overrideHeaders (optional) HTTP headers that will override default headers.
     *
     * @returns Response promise.
     */
    async delete(
        gateway: string,
        data: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ): Promise<Response> {
        const url: string = this.url + gateway;
        const urlInstance: URL = this.resolveUrl(url);

        // Default options are marked with *
        return fetch(urlInstance.toString(), {
            ...this.getDefaultRequestParams(),
            method: "DELETE",
            headers: this.getDefaultHeaders(overrideHeaders),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
    }

    /**
     * @description URL handler
     *
     * @param url Full absolute url or pathname e.g. /my-path.
     *
     * @returns URL object
     */
    resolveUrl(url: string | URL): URL {
        const urlParams = new URL(url, getLocationOrigin());
        return urlParams;
    }

    /**
     * @description Method that returns predefined HTTP headers
     *
     * @param override Headers to be overriden
     *
     * @returns Headers instance
     */
    getDefaultHeaders(override: Headers | Record<string, unknown> | undefined = undefined): Headers {
        return new Headers({
            "Content-Type": "application/json",
            ...override,
        });
    }

    /**
     * @description Method that returns predefined HTTP parameters (such as "cache", "referrerPolicy", etc.)
     *
     * @returns Headers instance
     */
    getDefaultRequestParams(): RequestInit {
        // Default options are marked with *
        return {
            method: "GET", // ? *GET, POST, PUT, DELETE, etc.
            mode: "cors", // ? no-cors, *cors, same-origin
            cache: "no-cache", // ? *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // ? include, *same-origin, omit
            redirect: "follow", // ? manual, *follow, error
            referrerPolicy: "no-referrer", // ? no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        };
    }
}

type ApiServiceHook = {
    get: (
        gateway: string,
        params?: RecordModel | Record<string, unknown>,
        overrideHeaders?: Headers | Record<string, unknown>,
    ) => Promise<Response>;
    post: (
        gateway: string,
        data?: RecordModel | Record<string, unknown>,
        overrideHeaders?: Headers | Record<string, unknown>,
    ) => Promise<Response>;
    put: (
        gateway: string,
        data?: RecordModel | Record<string, unknown>,
        overrideHeaders?: Headers | Record<string, unknown>,
    ) => Promise<Response>;
    delete: (
        gateway: string,
        data?: RecordModel | Record<string, unknown>,
        overrideHeaders?: Headers | Record<string, unknown>,
    ) => Promise<Response>;
    isLoading: boolean;
};

export function useApiService<T extends ApiService>(service: T): ApiServiceHook {
    const [isLoading, setIsLoading] = useState(false);

    const getCallback = async (
        gateway: string,
        params: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ) => {
        setIsLoading(true);
        const response: Response = await service.get(gateway, params, overrideHeaders);
        setIsLoading(false);
        return Promise.resolve(response);
    };

    const postCallback = async (
        gateway: string,
        data: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ) => {
        setIsLoading(true);
        const response: Response = await service.post(gateway, data, overrideHeaders);
        setIsLoading(false);
        return Promise.resolve(response);
    };

    const putCallback = async (
        gateway: string,
        data: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | Record<string, unknown> | undefined = undefined,
    ) => {
        setIsLoading(true);
        const response: Response = await service.put(gateway, data, overrideHeaders);
        setIsLoading(false);
        return Promise.resolve(response);
    };

    const deleteCallback = async (
        gateway: string,
        data: RecordModel | Record<string, unknown> | undefined = undefined,
        overrideHeaders: Headers | undefined = undefined,
    ) => {
        setIsLoading(true);
        const response: Response = await service.delete(gateway, data, overrideHeaders);
        setIsLoading(false);
        return Promise.resolve(response);
    };

    return {
        get: getCallback,
        post: postCallback,
        put: putCallback,
        delete: deleteCallback,
        isLoading,
    };
}

export default ApiService;
