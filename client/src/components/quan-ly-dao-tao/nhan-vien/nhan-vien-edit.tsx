'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { updateNhanVien } from "@/lib/axios/service/nhan-vien-service";
import Grid from "@mui/material/Grid";
import { NhanVien } from "@/lib/axios/model/nhan-vien";
import dayjs from "dayjs";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Eye, EyeClosed } from "@phosphor-icons/react";

const schema = zod.object({
  id: zod.number(),
  hoVaTen: zod.string().min(1, { message: 'Họ và tên bắt buộc.' }),
  namSinh: zod.number({
    required_error: 'Năm sinh bắt buộc.',
    invalid_type_error: 'Năm sinh phải là số.'
  }).min(1900, { message: 'Năm sinh phải lớn hơn 1900.' })
    .max(dayjs().year(), { message: 'Năm sinh không thể lớn hơn năm hiện tại.' }),
  email: zod.string().min(1, { message: 'Email bắt buộc.' }).email({ message: 'Email không đúng định dạng.' }),
  soDienThoai: zod.string().min(10, { message: 'Số điện thoại bắt buộc.' }),
  diaChi: zod.string().min(1, { message: 'Địa chỉ bắt buộc.' }),
  username: zod.string(),
  password: zod.string()
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, 
      'Mật khẩu tối thiểu 6 kí tự, ít nhất một kí tự in hoa, 1 chữ số và 1 kí tự đặc biệt.')
    .optional(),
  huy: zod.boolean().optional(),
});

type NhanVienValues = zod.infer<typeof schema>;

export function NhanVienEdit(props: { nhanVien: NhanVien, triggerRefresh: () => void }): React.JSX.Element {
  const { triggerRefresh, nhanVien } = props;
  const [isPending, setIsPending] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<NhanVienValues>({
    defaultValues: {
      ...nhanVien,
      soDienThoai: nhanVien.soDienThoai ?? '',
      diaChi: nhanVien.diaChi ?? '',
      huy: nhanVien.huy ?? false
    },
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: NhanVienValues): Promise<void> => {
    setIsPending(true);
    try {
      await updateNhanVien({
        ...values,
        role: "USER"
      });
      triggerRefresh();
    } catch (e) {
      console.error(e);
      alert("Có lỗi xảy ra khi lưu nhân viên. Vui lòng thử lại!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Stack spacing={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="hoVaTen"
              render={({ field }) => (
                <FormControl error={Boolean(errors.hoVaTen)} fullWidth>
                  <InputLabel>Họ Và Tên</InputLabel>
                  <OutlinedInput {...field} label="Họ Và Tên" />
                  {errors.hoVaTen && <FormHelperText>{errors.hoVaTen.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="namSinh"
              render={({ field }) => (
                <FormControl error={Boolean(errors.namSinh)} fullWidth>
                  <InputLabel>Năm Sinh</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Năm Sinh"
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {errors.namSinh && <FormHelperText>{errors.namSinh.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="soDienThoai"
              render={({ field }) => (
                <FormControl error={Boolean(errors.soDienThoai)} fullWidth>
                  <InputLabel>Số Điện Thoại</InputLabel>
                  <OutlinedInput {...field} label="Số Điện Thoại" />
                  {errors.soDienThoai && <FormHelperText>{errors.soDienThoai.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)} fullWidth>
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput {...field} label="Email" />
                  {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Tên Đăng Nhập</InputLabel>
                  <OutlinedInput {...field} label="Tên Đăng Nhập" disabled />
                </FormControl>
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)} fullWidth>
                  <InputLabel>Mật Khẩu</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Mật Khẩu"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <Eye /> : <EyeClosed />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item md={12} xs={12}>
            <Controller
              control={control}
              name="diaChi"
              render={({ field }) => (
                <FormControl error={Boolean(errors.diaChi)} fullWidth>
                  <InputLabel>Địa Chỉ</InputLabel>
                  <OutlinedInput {...field} label="Địa Chỉ" />
                  {errors.diaChi && <FormHelperText>{errors.diaChi.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid container item md={12} xs={12} justifyContent="flex-end">
            <Button disabled={isPending} type="submit" variant="contained">
              Lưu
            </Button>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
