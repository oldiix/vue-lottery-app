export type Gender = 'male' | 'female'

export interface UserAddress {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface UserCompany {
  name: string
  department: string
  title: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  age: number
  gender: Gender
  phone: string
  password?: string
  maidenName?: string
  birthDate?: string
  image?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  university?: string
  role?: string
  address?: UserAddress
  company?: UserCompany
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'
> & {
  password: string
}

export type UpdateUserDto = Partial<CreateUserDto>

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
