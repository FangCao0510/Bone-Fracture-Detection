import axiosInstance from "@/lib/axios/axios";
import { handleApiError } from "@/lib/axios/error-handler";
import { toast } from "sonner";
import { User } from "@/types/user";

export interface UpdateAccountRequest {
  username: string;
  email?: string;
  diaChi?: string;
  soDienThoai?: string;
}

export async function updateAccount(values: UpdateAccountRequest) {
  try {
    const res = await axiosInstance.put('/auth/current-user', values)
    toast.success('Cập nhật hồ sơ thành công.')
    return res.data as User
  } catch (err) {
    handleApiError(err)
  }
}