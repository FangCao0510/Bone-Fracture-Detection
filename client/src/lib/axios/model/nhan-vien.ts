import {Page, SearchParameter} from "@/lib/axios/model/pagination";

export interface NhanVien {
  id?: number
  hoVaTen: string
  namSinh: number
  huy?: boolean
  username: string
  email: string
  soDienThoai: string | null
  diaChi: string | null
  role?: string
}

export interface NhanVienPage extends Page<NhanVien> {
}

export interface NhanVienSearchParameter extends SearchParameter {
}
