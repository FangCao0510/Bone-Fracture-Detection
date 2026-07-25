'use client';

import * as React from 'react';
import {useEffect} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import {Controller, useForm} from 'react-hook-form';
import Grid from "@mui/material/Grid";
import {toast} from "sonner";
import Button from "@mui/material/Button";
import {editBenhNhan} from "@/lib/axios/service/benh-nhan-service";
import {benhNhanSchema, BenhNhanValues, transform} from "@/lib/schema/benh-nhan";
import {BenhNhanView} from "@/lib/axios/model/benh-nhan";
import {handleApiError} from "@/lib/axios/error-handler";
import {DatePicker} from "@mui/x-date-pickers";
import {Autocomplete, AutocompleteRenderInputParams, TextField} from "@mui/material";
import dayjs from "dayjs";
import {useUser} from "@/hooks/use-user";


export function BenhNhanEditModal(props: {
  benhNhan: BenhNhanView
  afterSubmit: () => void
}): React.JSX.Element {
  const {afterSubmit, benhNhan} = props
  const [isPending, setIsPending] = React.useState<boolean>(false);
 
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: {errors}
  } = useForm<BenhNhanValues>({
    defaultValues: benhNhan,
    resolver: zodResolver(benhNhanSchema)
  });
  const onSubmit = React.useCallback(
    async (values: BenhNhanValues) => {
      setIsPending(true);
      const benhNhanResult = await editBenhNhan(transform(values))

      if (benhNhanResult) {
        toast.success('Cập nhật thành công.')
      }
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
                    value={dayjs(field.value)}
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
                    value={dayjs(field.value)}
                    format="DD/MM/YYYY"
                    label="Ngày tạo"
                  />
                  {errors.ngayTao ?
                    <FormHelperText>{errors.ngayTao.message!}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Controller
              control={control}
              name="soDienThoai"
              render={({field}) => (
                <FormControl error={Boolean(errors.soDienThoai)} fullWidth>
                  <InputLabel>Số điện thoại</InputLabel>
                  <OutlinedInput {...field} label="Số điện thoại"
                                 value={field.value}
                  />
                  {errors.soDienThoai ? <FormHelperText>{errors.soDienThoai.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Controller
              control={control}
              name="gioiTinh"
              render={({field}) => (
                <FormControl error={Boolean(errors.gioiTinh)} fullWidth>
                  <InputLabel>Tên bệnh nhân</InputLabel>
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
              name="diaChiChiTiet"
              render={({field}) => (
                <FormControl fullWidth>
                  <InputLabel>Địa chỉ </InputLabel>
                  <OutlinedInput {...field} label="Địa chỉ" value={field.value}/>
                </FormControl>
              )}
            />
          </Grid>
          <Grid container item md={12} xs={12} justifyContent="flex-end" spacing={2}>
              <Grid item>
                <Button disabled={isPending } type="submit" variant="contained">
                  Lưu
                </Button>
              </Grid>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
