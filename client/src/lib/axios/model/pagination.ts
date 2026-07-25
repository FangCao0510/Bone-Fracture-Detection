export interface Pageable {
  CurrentPage: number
  TotalPages: number
  TotalCount: number
  PageSize: number
  HasPrevious: boolean
  HasNext: boolean
}

export interface SearchParameter {
  pageSize: number
  pageNumber: number
}

export interface Page<T> {
  pageable: Pageable
  content: T[]
}
