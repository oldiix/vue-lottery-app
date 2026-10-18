import { tokenStorage } from '@/api/token-storage'

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

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...init } = options
  const requestHeaders = new Headers(headers)

  if (init.body) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = tokenStorage.getAccessToken()
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: requestHeaders })

  if (!response.ok) {
    throw new HttpError(response.status, await getErrorMessage(response))
  }

  return (await response.json()) as T
}
