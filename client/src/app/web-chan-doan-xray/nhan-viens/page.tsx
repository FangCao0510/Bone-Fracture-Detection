"use client";
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Download as DownloadIcon} from '@phosphor-icons/react/dist/ssr/Download';
import {Plus as PlusIcon} from '@phosphor-icons/react/dist/ssr/Plus';
import {Upload as UploadIcon} from '@phosphor-icons/react/dist/ssr/Upload';
import {importDanhSachNhanVien, postDanhSachNhanVien} from "@/lib/axios/service/nhan-vien-service";
import {NhanViensTable} from "@/components/quan-ly-dao-tao/nhan-vien/nhan-viens-table";
import {NhanViensFilters} from "@/components/quan-ly-dao-tao/nhan-vien/nhan-viens-filters";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Transition} from "@/components/modal/form-modal";
import {NhanVienForm} from "@/components/quan-ly-dao-tao/nhan-vien/nhan-vien-form";
import {NhanVienPage} from "@/lib/axios/model/nhan-vien";
import {handleApiError} from "@/lib/axios/error-handler";
import {useSearch} from "@/hooks/use-search";
import {useRefresh} from "@/hooks/use-refresh";
import {useModal} from "@/hooks/use-modal";
import {Info} from "@phosphor-icons/react";
import Tooltip from "@mui/material/Tooltip";
import Link from 'next/link';
import {BACKEND_BASE_URL} from "@/config";
import {toast} from "sonner";

export default function Page(): React.JSX.Element {
  const {searchParams, addSearchParam} = useSearch()
  const page = Number(searchParams.get('page') ?? 1)
  const rowsPerPage = Number(searchParams.get('size') ?? 20)
  const {refresh, toggleRefresh} = useRefresh()
  const {isOpen: isThemMoiOpen, open: openThemMoi, close: closeThemMoi} = useModal(false)
  const {isOpen: isImportOpen, open: openImport, close: closeImport} = useModal(false)
  const [nhanViens, setNhanViens] = useState<NhanVienPage>();
  const [importFile, setImportFile] = useState<File>();
  const onImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setImportFile(event.target.files[0]);
      openImport()
    }
  }
  const importNhanVien = useCallback(async () => {
    if (importFile) {
      await importDanhSachNhanVien(importFile)
      closeImport()
      toggleRefresh()
      return;
    }
    toast.error("Không tìm thấy file import danh sách nhân viên.")
    closeImport()
  }, [importFile])
  const changePage = useCallback((changedPage: number) => {
    addSearchParam('page', (changedPage + 1).toString())
  }, [])

  useEffect(() => {
    postDanhSachNhanVien(page, rowsPerPage)
      .then(value => {
        setNhanViens(value)
      })
      .catch(handleApiError)
  }, [refresh, page])

  return (
    <>
      <title>Nhân Viên</title>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{flex: '1 1 auto'}}>
            <Typography variant="h4">Danh Sách Nhân Viên</Typography>
            <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
              <Button color="inherit"
                      component="label"
                      startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"/>}>
                <input hidden
                       type="file"
                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                       onChange={event => {
                         onImportFile(event)
                       }}/>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)"/>}>
                Export
              </Button>
              <Tooltip title={
                <>
                  Tải mẫu Danh Sách Nhân Viên tại <Link href={`${BACKEND_BASE_URL}/templates/NhapNhanVienTemplate.xlsx`}
                                                        target="_blank">đây</Link>
                </>
              }>
                <Info fontSize="var(--icon-fontSize-md)"/>
              </Tooltip>
            </Stack>
          </Stack>
          <div>
            <Button onClick={openThemMoi} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)"/>}
                    variant="contained">
              Thêm Mới
            </Button>
          </div>
        </Stack>
        <NhanViensFilters/>
        {nhanViens && <NhanViensTable
          onPageChange={changePage}
          nhanVienPage={nhanViens}
          rowsPerPage={20}
          triggerRefresh={toggleRefresh}
        />}
      </Stack>
      <Dialog
        open={isThemMoiOpen}
        TransitionComponent={Transition}
        onClose={closeThemMoi}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Thêm Mới Nhân Viên</DialogTitle>
        <DialogContent dividers>
          <NhanVienForm triggerRefresh={() => {
            close()
            toggleRefresh()
          }}/>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImportOpen}
        TransitionComponent={Transition}
        onClose={closeImport}
      >
        <DialogTitle>Import Danh Sách Nhân Viên</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn import danh sách nhân viên từ file: {importFile?.name}?
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => {
            closeImport()
            setImportFile(undefined)
          }}>
            Từ chối
          </Button>
          <Button onClick={importNhanVien}>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

