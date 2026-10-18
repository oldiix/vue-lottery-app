import type { User } from '@/types/user'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export type AuthUser = Pick<
  User,
  'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'gender' | 'image'
>

export type LoginResponse = AuthTokens & AuthUser
