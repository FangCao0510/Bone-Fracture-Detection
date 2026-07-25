import React from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {BenhNhanView} from "@/lib/axios/model/benh-nhan";
import dayjs from "dayjs";

export function BenhNhanDetailModal({benhNhan}: {
  benhNhan: BenhNhanView
}) {
  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Tên bệnh nhân</InputLabel>
          <OutlinedInput label="Tên bệnh nhân"
                         readOnly
                         value={benhNhan.tenBenhNhan}
          />
        </FormControl>
      </Grid>
      <Grid item md={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Ngày sinh</InputLabel>
          <OutlinedInput label="Ngày sinh"
                         readOnly
                         value={dayjs(benhNhan.ngaySinh).format("DD/MM/YYYY")}
          />
        </FormControl>
      </Grid>
      <Grid item md={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Ngày tiếp nhận</InputLabel>
          <OutlinedInput label="Ngày tiếp nhận"
                         readOnly
                         value={dayjs(benhNhan.ngayTao).format("DD/MM/YYYY")}
          />
        </FormControl>
      </Grid>
      <Grid item md={6} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Giới tính</InputLabel>
          <OutlinedInput
            readOnly
            label="Giới tính"
            value={benhNhan.gioiTinh}
          />
        </FormControl>
      </Grid>
       <Grid item md={12} xs={12}>
        <FormControl fullWidth>
          <InputLabel>Số điện thoại</InputLabel>
          <OutlinedInput label="Số điện thoại"
                         readOnly
                         value={benhNhan.soDienThoai}
          />
        </FormControl>
      </Grid>
      {benhNhan.diaChiChiTiet && (
        <Grid item md={12} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Địa chỉ</InputLabel>
            <OutlinedInput label="Mô tả" readOnly value={benhNhan.diaChiChiTiet}/>
          </FormControl>
        </Grid>
      )}
    </Grid>
  )
}
