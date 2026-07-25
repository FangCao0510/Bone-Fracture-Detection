import {Page, SearchParameter} from "@/lib/axios/model/pagination";

export interface BenhNhanUpsert {
  id: number
  tenBenhNhan: string
  ngaySinh: string
  gioiTinh: string
  ngayTao: Date | null
  diaChiChiTiet: string
  soDienThoai: string
  nguoitao: number
  huy: boolean
  maYTe?: number
}

export interface BenhNhanPage extends Page<BenhNhanView> {
}

export interface BenhNhanSearchParameter extends SearchParameter {
  fromDate?: string
  toDate?: string
  tenBenhNhan?: string
}

export interface BenhNhanView {
id: number
  tenBenhNhan: string
  ngaySinh: string
  gioiTinh: string
  ngayTao: Date | null
  diaChiChiTiet: string
  soDienThoai: string
  nguoitao: number
  huy: boolean
  maYTe?: number
}
