import { useMemo } from 'react';

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

        const finalHeaders = {
            'Accept': 'application/json, text/plain;q=0.9,*/*;q=0.8',
            ...(isFormData || isUrlEncoded ? {} : { 'Content-Type': 'application/json' }),
            ...(isUrlEncoded ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
            ...(headers || {})
        };

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
