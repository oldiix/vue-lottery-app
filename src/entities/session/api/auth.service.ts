import { http } from '@/shared/api'
import type { AuthTokens, LoginCredentials, LoginResponse } from '../model/types'
import type { User } from '@/entities/user/model/types'

const TOKEN_LIFETIME_MINUTES = 30

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }

  me(): Promise<User> {
    return http<User>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }
}
