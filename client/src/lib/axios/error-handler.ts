import {toast} from "sonner";
import {AxiosError} from "axios";

export function handleApiError(e: unknown) {
  if (typeof (e) === "string") {
    toast.error(e)
  } else if (e instanceof AxiosError) {
    const ex = e as AxiosError
    switch (ex.response?.status) {
      case 403:
        toast.error("Bạn không đủ quyền truy cập. Xin liên hệ Admin để làm việc.")
        break;
      case 400: {
        const data = ex.response?.data as { detail?: string; title?: string } | undefined;
        const message = data?.detail || data?.title;
        if (message) {
          toast.error(`Lỗi: ${message}`)
        } else {
          toast.error(`Lỗi: ${JSON.stringify(ex.response?.data)}`)
        }
        break;
      }
      default:
        toast.error("Lỗi hệ thống. Xin vui lòng liên hệ Admin.")
    }
  }
}
