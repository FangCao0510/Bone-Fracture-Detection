"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export interface BenhNhanFiltersProps {
  fromDate?: string
  toDate?: string
  tenBenhNhan?: string
  onFromDateChange?: (value?: string) => void
  onToDateChange?: (value?: string) => void
  onTenBenhNhanChange?: (value?: string) => void
}
export function BenhNhanFilters({fromDate, toDate, tenBenhNhan, onFromDateChange, onToDateChange, onTenBenhNhanChange}: BenhNhanFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
        <TextField
          label="Tên bệnh nhân"
          value={tenBenhNhan ?? ''}
          onChange={e => onTenBenhNhanChange?.(e.target.value || undefined)}
        />
        <TextField
          type="date"
          label="Từ ngày"
          InputLabelProps={{ shrink: true }}
          value={fromDate ?? ''}
          onChange={e => onFromDateChange?.(e.target.value || undefined)}
        />
        <TextField
          type="date"
          label="Đến ngày"
          InputLabelProps={{ shrink: true }}
          value={toDate ?? ''}
          onChange={e => onToDateChange?.(e.target.value || undefined)}
        />
      </Stack>
    </Card>
  );
}