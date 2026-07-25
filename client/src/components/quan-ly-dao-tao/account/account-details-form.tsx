'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Grid from '@mui/material/Unstable_Grid2'
import { Controller, useForm } from 'react-hook-form'
import { z as zod } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/hooks/use-user'
import { updateAccount } from '@/lib/axios/service/account-service'

const schema = zod.object({
  email: zod.string().email({ message: 'Email không hợp lệ' }),
  diaChi: zod.string().optional(),
  soDienThoai: zod.string().optional()
})

type Values = zod.infer<typeof schema>

export function AccountDetailsForm(): React.JSX.Element {
  const { user, checkSession } = useUser()

  const { control, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email ?? '',
      diaChi: user?.diaChi ?? '',
      soDienThoai: user?.soDienThoai ?? ''
    }
  })

  React.useEffect(() => {
    reset({
      email: user?.email ?? '',
      diaChi: user?.diaChi ?? '',
      soDienThoai: user?.soDienThoai ?? ''
    })
  }, [user, reset])

  const onSubmit = React.useCallback(async (values: Values) => {
    if (!user) return
    await updateAccount({
      username: user.username,
      ...values
    })
    await checkSession?.()
  }, [user, checkSession])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Thông tin có thể chỉnh sửa" title="Hồ sơ cá nhân" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.email)}>
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput {...field} label="Email" />
                    {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name="soDienThoai"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Số điện thoại</InputLabel>
                    <OutlinedInput {...field} label="Số điện thoại" />
                  </FormControl>
                )}
              />
            </Grid>
            <Grid md={12} xs={12}>
              <Controller
                control={control}
                name="diaChi"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Địa chỉ</InputLabel>
                    <OutlinedInput {...field} label="Địa chỉ" />
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Lưu</Button>
        </CardActions>
      </Card>
    </form>
  )
}
