import axiosInstance from "@/lib/axios/axios";
import {NhanVien, NhanVienPage, NhanVienSearchParameter} from "@/lib/axios/model/nhan-vien";
import {handleApiError} from "@/lib/axios/error-handler";
import {UserInfo} from "@/types/user";
import {toast} from "sonner";

export async function getDanhSachNhanVien(page: number, size: number) {
  const response = await axiosInstance.get(`/nhan-vien?page=${page}&size=${size}`)
  return response.data as NhanVien[]
}

export async function postDanhSachNhanVien(page: number, size: number) {
  const response = await axiosInstance.post(`/nhan-vien/search`, {
    pageNumber: page,
    pageSize: size
  } satisfies NhanVienSearchParameter)
  const pagination = JSON.parse(response.headers['x-pagination'] as string)
  return {
    content: response.data,
    pageable: pagination
  } satisfies NhanVienPage
}

export async function addNhanVien(nhanVien: NhanVien) {
  try {
    const res =  await axiosInstance.post('/nhan-vien', nhanVien)
    toast.success('Thêm mới nhân viên thành công.')
    return res
  } catch (err) {
    handleApiError(err)
  }
}

export async function updateNhanVien(nhanVien: NhanVien) {
  try {
    const res = await axiosInstance.put(`/nhan-vien/${nhanVien.id}`, nhanVien)
    toast.success('Chỉnh sửa nhân viên thành công.')
    return res
  } catch (err) {
    handleApiError(err)
  }
}

export async function getUserInfos() {
  try {
    const res = await axiosInstance.get('/auth/users')
    return res.data as UserInfo[]
  } catch (err) {
    handleApiError(err)
  }
}

export async function importDanhSachNhanVien(importFile: File) {
  try {
    const res = await axiosInstance.postForm("/nhan-vien/import", {
      file: importFile,
    })
    toast.success('Import danh sách nhân viên thành công.')
    return res.data as NhanVien[]
  } catch (err: unknown) {
    handleApiError(err)
  }
}
