"use client";
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Download as DownloadIcon} from '@phosphor-icons/react/dist/ssr/Download';
import {Plus as PlusIcon} from '@phosphor-icons/react/dist/ssr/Plus';
import {Upload as UploadIcon} from '@phosphor-icons/react/dist/ssr/Upload';
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {Transition} from "@/components/modal/form-modal";
import {useSearch} from "@/hooks/use-search";
import {useRefresh} from "@/hooks/use-refresh";
import {handleApiError} from "@/lib/axios/error-handler";
import {BenhNhanPage} from "@/lib/axios/model/benh-nhan";
import {getDanhSachBenhNhan} from "@/lib/axios/service/benh-nhan-service";
import {BenhNhanForm} from "@/components/quan-ly-dao-tao/benh-nhan/benh-nhan-form";
import {BenhNhanFilters} from "@/components/quan-ly-dao-tao/benh-nhan/benh-nhan-filters";
import {BenhNhanTable} from "@/components/quan-ly-dao-tao/benh-nhan/benh-nhan-table";


export default function Page(): React.JSX.Element {
  const {searchParams, addSearchParam} = useSearch()
  const page = Number(searchParams.get('page') ?? 1)
  const {refresh, toggleRefresh} = useRefresh()
  const [benhNhanPage, SetBenhNhanPage] = useState<BenhNhanPage>();
  const [createViewOpen, setCreateViewOpen] = React.useState(false);
    const today = new Date().toISOString().substring(0,10)
  const [fromDate, setFromDate] = useState<string>(today)
  const [toDate, setToDate] = useState<string>(today)
  const [tenBenhNhan, setTenBenhNhan] = useState<string>()

  const changePage = useCallback((changedPage: number) => {
    addSearchParam('page', (changedPage + 1).toString())
  }, [])
  const openCreateView = useCallback((open: boolean) => {
    setCreateViewOpen(open);
  }, []);
  useEffect(() => {
    getDanhSachBenhNhan(page, 20, fromDate, toDate, tenBenhNhan)
      .then(value => {
        console.log('Dữ liệu bệnh nhân:', value);
        SetBenhNhanPage(value)
      })
      .catch(handleApiError);
 }, [refresh, page, fromDate, toDate, tenBenhNhan])

  return (
    <>
      <title>Bệnh Nhân</title>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{flex: '1 1 auto'}}>
            <Typography variant="h4">Danh Sách Bệnh Nhân</Typography>
            <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
              <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"/>}>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)"/>}>
                Export
              </Button>
            </Stack>
          </Stack>
          <div>
            <Button onClick={() => {
              openCreateView(true)
            }}
                    startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)"/>}
                    variant="contained">
              Thêm mới
            </Button>
          </div>
        </Stack>
        <BenhNhanFilters
          fromDate={fromDate}
          toDate={toDate}
          tenBenhNhan={tenBenhNhan}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onTenBenhNhanChange={setTenBenhNhan}
        />
        {benhNhanPage &&
          <BenhNhanTable
            onPageChange={changePage}
            benhNhanPage={benhNhanPage}
            rowsPerPage={20}
            triggerRefresh={toggleRefresh}
          />
        }
      </Stack>
      <Dialog
        open={createViewOpen}
        TransitionComponent={Transition}
        onClose={() => {
          openCreateView(false)
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Tạo mới Bệnh Nhân</DialogTitle>
        <DialogContent dividers>
          <BenhNhanForm afterSubmit={() => {
            toggleRefresh()
            openCreateView(false)
          }}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

