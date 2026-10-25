import { http } from '@/shared/api/http-client.ts'
import type {
  Creatable,
  Deletable,
  Editable,
  ListParams,
  PaginatedResult,
  Readable,
} from '@/shared/api/interfaces.ts'
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersResponse,
} from '@/entities/user/model/types.ts'

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable<User>
{
  private readonly resource = '/users'

  async getAll({ limit = 10, skip = 0, q = '' }: ListParams = {}): Promise<PaginatedResult<User>> {
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    let path = this.resource

    if (q) {
      params.set('q', q)
      path = `${this.resource}/search`
    }

    const data = await http<UsersResponse>(`${path}?${params}`)
    return { items: data.users, total: data.total }
  }

  getById(id: number): Promise<User> {
    return http<User>(`${this.resource}/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>(`${this.resource}/add`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`${this.resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(id: number): Promise<User> {
    return http<User>(`${this.resource}/${id}`, { method: 'DELETE' })
  }
}
