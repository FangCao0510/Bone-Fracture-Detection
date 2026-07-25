'use client'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {AccountDetailsForm} from '@/components/quan-ly-dao-tao/account/account-details-form';
import {AccountInfo} from '@/components/quan-ly-dao-tao/account/account-info';

export default function Page(): React.JSX.Element {
  return (
    <>
      <title>Hồ Sơ Cá Nhân</title>
      <Stack spacing={3}>
        <div>
          <Typography variant="h4">Tài Khoản</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid lg={4} md={6} xs={12}>
            <AccountInfo/>
          </Grid>
          <Grid lg={8} md={6} xs={12}>
            <AccountDetailsForm/>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
