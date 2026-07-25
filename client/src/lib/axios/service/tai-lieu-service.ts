import axiosInstance from "@/lib/axios/axios";
import {handleApiError} from "@/lib/axios/error-handler";

export async function uploadTaiLieu(deTaiId: number, taiLieus: File[]) {
  try {
    const formData = new FormData();
    taiLieus.forEach((file, index) => {
      formData.append(`taiLieus[${index}].loai`, "file")
      formData.append(`taiLieus[${index}].file`, file)
    })
    return await axiosInstance.postForm(`/de-tai/${deTaiId}`, formData)
  } catch (err) {
    handleApiError(err)
  }
}

export async function uploadTaiLieus(deTaiId: number, files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`taiLieus[${index}].loai`, "file")
      formData.append(`taiLieus[${index}].file`, file)
    })
    return await axiosInstance.postForm(`/de-tai/${deTaiId}`, formData)
  } catch (err) {
    handleApiError(err)
  }
}
