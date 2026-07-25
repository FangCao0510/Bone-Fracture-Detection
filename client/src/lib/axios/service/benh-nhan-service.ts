import axiosInstance from "@/lib/axios/axios";
import {handleApiError} from "@/lib/axios/error-handler";
import {BenhNhanPage, BenhNhanSearchParameter, BenhNhanUpsert, BenhNhanView} from "@/lib/axios/model/benh-nhan";

export async function getDanhSachBenhNhan(page: number, size: number, fromDate?: string, toDate?: string, tenBenhNhan?: string) {
  const response = await axiosInstance.post(`/benh-nhan/search`, {
    pageNumber: page,
    pageSize: size,
    fromDate,
    toDate,
    tenBenhNhan
  } satisfies BenhNhanSearchParameter)
  const pagination = JSON.parse(response.headers['x-pagination'] as string)
  return {
    content: response.data,
    pageable: pagination
  } satisfies BenhNhanPage
}

export async function addBenhNhan(benhNhan: BenhNhanUpsert) {
  try {
    return await axiosInstance.post('/benh-nhan', benhNhan)
  } catch (err: unknown) {
    handleApiError(err)
  }
}

export async function editBenhNhan(benhNhan: BenhNhanUpsert) {
  try {
    return await axiosInstance.put(`/benh-nhan/${benhNhan.id}`, benhNhan)
  } catch (err: unknown) {
    handleApiError(err)
  }
}

export async function getBenhNhan(benhNhanId: number) {
  try {
    const res = await axiosInstance.get(`/benh-nhan/${benhNhanId}`)
    return res.data as BenhNhanView
  } catch (err: unknown) {
    handleApiError(err)
  }
}
