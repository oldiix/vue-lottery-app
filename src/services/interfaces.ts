export interface ListParams {
  limit?: number
  skip?: number
  q?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
}

export interface Readable<T> {
  getAll(params?: ListParams): Promise<PaginatedResult<T>>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate = Omit<T, 'id'>> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate = Partial<T>> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<T> {
  delete(id: number): Promise<T>
}
