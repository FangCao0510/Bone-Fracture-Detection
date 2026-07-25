'use client';

import * as React from 'react';
import {useEffect} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import {Controller, useForm} from 'react-hook-form';
import Grid from "@mui/material/Grid";
import {addBenhNhan} from "@/lib/axios/service/benh-nhan-service";
import {benhNhanSchema, BenhNhanValues, transform} from "@/lib/schema/benh-nhan";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from 'dayjs';
// import {Autocomplete, AutocompleteRenderInputParams, TextField} from "@mui/material";
// import {handleApiError} from "@/lib/axios/error-handler";

export function BenhNhanForm(props: {
  afterSubmit: () => void
}): React.JSX.Element {
  const {afterSubmit} = props
  const [isPending, setIsPending] = React.useState<boolean>(false);

const {
  control,
  handleSubmit,
  setError,
  formState: { errors }
} = useForm<BenhNhanValues>({
  resolver: zodResolver(benhNhanSchema),
  defaultValues: {
    ngayTao: dayjs(),
  }
});
  const onSubmit = React.useCallback(
    async (values: BenhNhanValues) => {
      setIsPending(true);
      await addBenhNhan(transform(values))
      setIsPending(false)
      afterSubmit()
    },
    [setError]
  );

  return (
    <Stack spacing={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <Controller
              control={control}
              name="tenBenhNhan"
              render={({field}) => (
                <FormControl error={Boolean(errors.tenBenhNhan)} fullWidth>
                  <InputLabel>Tên bệnh nhân</InputLabel>
                  <OutlinedInput {...field} label="Tên bệnh nhân"
                                 value={field.value}
                  />
                  {errors.tenBenhNhan ? <FormHelperText>{errors.tenBenhNhan.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="ngaySinh"
              render={({field}) => (
                <FormControl error={Boolean(errors.ngaySinh)} fullWidth>
                  <DatePicker
                    {...field}
                    format="DD/MM/YYYY"
                    label="Ngày sinh"
                  />
                  {errors.ngaySinh ?
                    <FormHelperText>{errors.ngaySinh.message!}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="ngayTao"
              render={({field}) => (
                <FormControl error={Boolean(errors.ngayTao)} fullWidth>
                  <DatePicker
                    {...field}
                    format="DD/MM/YYYY"
                    label="Ngày tiếp nhận"
                  />
                  {errors.ngayTao ?
                    <FormHelperText>{errors.ngayTao.message!}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
         <Grid item md={6} xs={12}>
            <Controller
              control={control}
              name="gioiTinh"
              render={({field}) => (
                <FormControl error={Boolean(errors.gioiTinh)} fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <OutlinedInput {...field} label="Giới tính"
                                 value={field.value}
                  />
                  {errors.gioiTinh ? <FormHelperText>{errors.gioiTinh.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Controller
              control={control}
              name="soDienThoai"
              render={({field}) => (
                <FormControl error={Boolean(errors.SoDienThoai)} fullWidth>
                  <InputLabel>Số điện Thoại</InputLabel>
                  <OutlinedInput {...field} label="Số điện thoại"
                                 value={field.value}
                  />
                  {errors.SoDienThoai ? <FormHelperText>{errors.SoDienThoai.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
           <Grid item md={12} xs={12}>
            <Controller
              control={control}
              name="diaChiChiTiet"
              render={({field}) => (
                <FormControl fullWidth>
                  <InputLabel>Địa chỉ</InputLabel>
                  <OutlinedInput {...field} label="Địa chỉ" value={field.value}/>
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
