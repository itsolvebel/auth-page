import { config } from '@/config'
import { FetchingError } from '@/lib/errors'
import Cookies from 'js-cookie'

type Fetcher = {
    get<T = any>(resource: string, options?: RequestInit): Promise<T>;
    post<T = any>(resource: string, body: any, options?: RequestInit): Promise<T>;
    put<T = any>(resource: string, body: any, options?: RequestInit): Promise<T>;
    delete<T = any>(resource: string, body: any, options?: RequestInit): Promise<T>;
    setToken(token: string): void;
}

let token: string
const Fetcher = (baseUrl: string): Fetcher => {
    const setToken = (t: string) => {
        token = t
        localStorage.setItem('token', t)
        Cookies.set('token', token, { expires: 9999999, sameSite: 'None', secure: true })
    }
    const makeRequest = async <T = any>(method: string, resource: string, options?: RequestInit, body?: any): Promise<T> => {
        resource = filterResourceString(resource)
        const requestOptions: RequestInit = {
            credentials: 'include',
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || localStorage.getItem('token')}`,
                ...options?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        }

        const response = await fetch(`${baseUrl}${resource}`, requestOptions)

        if (response.status === 401) {
            throw new FetchingError(response.status, 'Unauthorized', {})
        }

        const contentType = response.headers.get('content-type')

        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const errorBody = await response.json()
                throw new FetchingError(response.status, `Failed to ${method.toLowerCase()}`, errorBody)
            } else {
                throw new FetchingError(response.status, 'There was an error fetching', {})
            }
        }
        if (contentType && contentType.includes('application/json')) {
            return await response.json()
        } else {
            return response as any
        }
    }

    const get = async <T>(resource: string, options?: RequestInit): Promise<T> => {
        return makeRequest('GET', resource, options)
    }

    const post = async (resource: string, body: any, options?: RequestInit): Promise<any> => {
        return makeRequest('POST', resource, options, body)
    }
    const put = async (resource: string, body: any, options?: RequestInit): Promise<any> => {
        return makeRequest('PUT', resource, options, body)
    }

    const deleteRequest = async (resource: string, options?: RequestInit): Promise<any> => {
        return makeRequest('DELETE', resource, options)
    }

    return { get, post, put, delete: deleteRequest, setToken }
}

const filterResourceString = (resource: string) => {
    if (resource.slice(0, 1) !== '/') {
        return `/${resource}`
    }
    return resource
}

const fetcher = Fetcher(config.BACKEND_URL)


export { fetcher }
