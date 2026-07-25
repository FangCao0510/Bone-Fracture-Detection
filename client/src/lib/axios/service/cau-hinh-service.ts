import axiosInstance from "@/lib/axios/axios";
import {CauHinh, CauHinhCreation, CauHinhPage, CauHinhSearchParameter} from "@/lib/axios/model/cau-hinh";

export async function getDanhSachDonViDaoTao(page: number, size: number) {
  const response = await axiosInstance.get(`/don-vi-dao-tao?page=${page}&size=${size}`)
  return response.data as CauHinh[]
}

export async function postDanhSachDonViDaoTao(page: number, size: number) {
  const response = await axiosInstance.post(`/don-vi-dao-tao/search`, {
    pageNumber: page,
    pageSize: size
  } satisfies CauHinhSearchParameter)
  const pagination = JSON.parse(response.headers['x-pagination'] as string)
  return {
    content: response.data,
    pageable: pagination
  } satisfies CauHinhPage
}

export async function addDonViDaoTao(input: CauHinhCreation) {
  await axiosInstance.post(`/don-vi-dao-tao`, input)
}

export async function updateDonViDaoTao(input: CauHinh) {
  await axiosInstance.put(`/don-vi-dao-tao/${input.id}`, input)
}

export async function getDanhSachHinhThucDaoTao(page: number, size: number) {
  const response = await axiosInstance.get(`/hinh-thuc-dao-tao?page=${page}&size=${size}`)
  return response.data as CauHinh[]
}

export async function postDanhSachHinhThucDaoTao(page: number, size: number) {
  const response = await axiosInstance.post(`/hinh-thuc-dao-tao/search`, {
    pageNumber: page,
    pageSize: size
  } satisfies CauHinhSearchParameter)
  const pagination = JSON.parse(response.headers['x-pagination'] as string)
  return {
    content: response.data,
    pageable: pagination
  } satisfies CauHinhPage
}

export async function addHinhThucDaoTao(input: CauHinhCreation) {
  await axiosInstance.post(`/hinh-thuc-dao-tao`, input)
}

export async function updateHinhThucDaoTao(input: CauHinh) {
  await axiosInstance.put(`/hinh-thuc-dao-tao/${input.id}`, input)
}
