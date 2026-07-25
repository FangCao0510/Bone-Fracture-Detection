import {z as zod} from "zod";
import dayjs from "dayjs";
import {BenhNhanUpsert} from "@/lib/axios/model/benh-nhan";


export const benhNhanSchema = zod.object({
  id: zod.number().optional(),
  tenBenhNhan: zod.string({required_error: 'Tên bắt buộc.'}),
  ngaySinh: zod.preprocess((val) => {
    return dayjs(val as string).format("YYYY-MM-DD")
  }, zod.string({required_error: "Ngày sinh bắt buộc."})
    .date()),
  ngayTao: zod.preprocess((val) => {
    return dayjs(val as string).format("YYYY-MM-DD")
  }, zod.string({required_error: "Ngày tạo bắt buộc."})
    .date()),
      gioiTinh: zod.string().optional(),
      soDienThoai: zod.string().optional(),
     diaChiChiTiet: zod.string().optional()
});

export type BenhNhanValues = zod.infer<typeof benhNhanSchema>;

export function transform(values: BenhNhanValues): BenhNhanUpsert {
  return {
    id: values.id ?? 0,
    tenBenhNhan: values.tenBenhNhan,
    ngaySinh: values.ngaySinh,
    ngayTao: values.ngayTao ? new Date(values.ngayTao) : null,
    gioiTinh: values.gioiTinh ?? "",
    soDienThoai: values.soDienThoai ?? "",
    diaChiChiTiet: values.diaChiChiTiet ?? "",
    nguoitao: 27, // Provide a suitable default or get from context
    huy: false    // Provide a suitable default value
  }
}
