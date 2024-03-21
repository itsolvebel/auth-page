import { FetchingError } from 'app/lib/errors'
import { config } from 'app/config'

type Status = 'Ok' | 'Error'

type ReturnType<T> = {
  status: Status
  data: T
  errors: any
}

type Fetcher = {
  get<T>(resource: string, options?: RequestInit): Promise<ReturnType<T>>
  post<T>(
    resource: string,
    body: any,
    options?: RequestInit
  ): Promise<ReturnType<T>>
  put<T>(
    resource: string,
    body: any,
    options?: RequestInit
  ): Promise<ReturnType<T>>
  delete<T>(
    resource: string,
    body: any,
    options?: RequestInit
  ): Promise<ReturnType<T>>
}

const Fetcher = (baseUrl: string): Fetcher => {
  const makeRequest = async <T>(
    method: string,
    resource: string,
    options?: RequestInit,
    body?: any
  ): Promise<ReturnType<T>> => {
    resource = filterResourceString(resource)
    const requestOptions: RequestInit = {
      credentials: 'include',
      method,
      headers: {
        'Content-Type': 'application/json',
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
        throw new FetchingError(
          response.status,
          `Failed to ${method.toLowerCase()}`,
          errorBody
        )
      } else {
        throw new FetchingError(
          response.status,
          'There was an error fetching',
          {}
        )
      }
    }
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as ReturnType<T>
    }
    return { status: 'Ok', data: {} as T, errors: {} }
  }

  const get = async <T>(
    resource: string,
    options?: RequestInit
  ): Promise<ReturnType<T>> => {
    return makeRequest<T>('GET', resource, options)
  }

  const post = async <T>(
    resource: string,
    body: any,
    options?: RequestInit
  ): Promise<ReturnType<T>> => {
    return makeRequest<T>('POST', resource, options, body)
  }
  const put = async <T>(
    resource: string,
    body: any,
    options?: RequestInit
  ): Promise<ReturnType<T>> => {
    return makeRequest<T>('PUT', resource, options, body)
  }

  const deleteRequest = async <T>(
    resource: string,
    options?: RequestInit
  ): Promise<ReturnType<T>> => {
    return makeRequest<T>('DELETE', resource, options)
  }

  return { get, post, put, delete: deleteRequest }
}

const filterResourceString = (resource: string) => {
  if (resource.slice(0, 1) !== '/') {
    return `/${resource}`
  }
  return resource
}

const fetcher = Fetcher(config.BACKEND_URL)

export { fetcher }
