export interface User {
  id: string
  avatar?: string
  email?: string
  username: string
  diaChi?: string
  soDienThoai?: string
  roles: UserRole[]

  [key: string]: unknown;
}

export interface UserInfo {
  username: string
  fullname: string
  added?: boolean
}

export type UserRole = "ADMIN" | "USER"

export function hasRole(role: UserRole, user: User | null): boolean {
  return Boolean(user?.roles.includes(role))
}
