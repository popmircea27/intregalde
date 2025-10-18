import { useMemo } from 'react';
import { wrapApi } from "./ApiWrapper";
import Logger from '../utils/logger';

export function useUsersApi() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;


    const makeUrl = (path, params) => {
        const q = params && Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : '';
        const safePath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${safePath}${q}`;
    };

    const request = async (path, { method = 'GET', params, body, headers, asFormUrlEncoded = false } = {}) => {
        if (!baseUrl) throw new Error('VITE_API_BASE_URL is not defined.');
        const url = makeUrl(path, params);

        const isFormData = body instanceof FormData;
        const isUrlEncoded = asFormUrlEncoded && body instanceof URLSearchParams;

        // 🔑 Ia token-ul JWT din localStorage
        const token = localStorage.getItem("token");
        if (!token || token === "null" || token.trim() === "") {
            localStorage.removeItem("token");
        }
        const finalHeaders = {
            'Accept': 'application/json, text/plain;q=0.9,*/*;q=0.8',
            ...(isFormData || isUrlEncoded ? {} : { 'Content-Type': 'application/json' }),
            ...(isUrlEncoded ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
            ...(headers || {}),
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // trimite token-ul automat
        };
        Logger.debug('API Request', { method, url, body, headers: finalHeaders });
        const res = await fetch(url, {
            method,
            headers: finalHeaders,
            body: body ? (isFormData || isUrlEncoded ? body : JSON.stringify(body)) : undefined
        });

        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await res.json() : await res.text();

        if (!res.ok) {
            const message = typeof data === 'string' ? data : data?.message || `HTTP ${res.status}`;
            const err = new Error(message);
            err.status = res.status;
            err.data = data;
            throw err;
        }
        Logger.debug('API Success Response', { url, data });
        return data;
    };

    return useMemo(() => ({
        baseUrl,
        request,
        get: (path, params, opts = {}) => request(path, { ...opts, method: 'GET', params }),
        post: (path, body, opts = {}) => request(path, { ...opts, method: 'POST', body }),
        put: (path, body, opts = {}) => request(path, { ...opts, method: 'PUT', body }),
        del: (path, opts = {}) => request(path, { ...opts, method: 'DELETE' })
    }), [baseUrl]);
}
