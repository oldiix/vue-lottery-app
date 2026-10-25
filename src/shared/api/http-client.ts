import { tokenStorage } from '@/shared/api/token-storage.ts'
import { ServiceProvider } from '@/shared/api/service-provider.ts'

const BASE_URL = import.meta.env.VITE_API_URL

export interface RequestOptions extends RequestInit {
  auth?: boolean
}

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string }
    return data.message ?? `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}: ${response.statusText}`
  }
}

type AuthFailureHandler = () => void

let onAuthFailure: AuthFailureHandler | null = null

let refreshPromise: Promise<boolean> | null = null

export function setAuthFailureHandler(handler: AuthFailureHandler): void {
  onAuthFailure = handler
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    return false
  }

  try {
    const data = await ServiceProvider.auth.refresh(refreshToken)
    tokenStorage.setTokens(data.accessToken, data.refreshToken)
    return true
  } catch {
    return false
  }
}

function refreshOnce(): Promise<boolean> {
  refreshPromise ??= refreshTokens().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

function sendRequest(
  path: string,
  init: RequestInit,
  headers: Headers,
  auth: boolean,
): Promise<Response> {
  if (auth) {
    const token = tokenStorage.getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return fetch(`${BASE_URL}${path}`, { ...init, headers })
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...init } = options
  const requestHeaders = new Headers(headers)

  if (init.body) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  let response = await sendRequest(path, init, requestHeaders, auth)

  if (response.status === 401 && auth) {
    const isRefreshed = await refreshOnce()
    if (isRefreshed) {
      response = await sendRequest(path, init, requestHeaders, auth)
    } else {
      tokenStorage.clear()
      onAuthFailure?.()
    }
  }

  if (!response.ok) {
    throw new HttpError(response.status, await getErrorMessage(response))
  }

  return (await response.json()) as T
}
