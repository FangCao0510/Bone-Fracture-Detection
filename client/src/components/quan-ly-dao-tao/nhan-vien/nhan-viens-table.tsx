"use client";

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {useSelection} from '@/hooks/use-selection';
import {NhanVien, NhanVienPage} from "@/lib/axios/model/nhan-vien";
import IconButton from "@mui/material/IconButton";
import {icons} from "@/components/quan-ly-dao-tao/layout/icons";
import {useModal} from "@/hooks/use-modal";
import {Transition} from "@/components/modal/form-modal";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {NhanVienEdit} from "@/components/quan-ly-dao-tao/nhan-vien/nhan-vien-edit";
import {useState} from "react";

interface NhanViensTableProps {
  nhanVienPage: NhanVienPage;
  rowsPerPage?: number;
  triggerRefresh: () => void;
  onPageChange: (page: number) => void;
}

export function NhanViensTable({
                                 nhanVienPage,
                                 rowsPerPage = 0,
                                 onPageChange,
                                 triggerRefresh
                               }: NhanViensTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return nhanVienPage.content.map((nhanVien) => nhanVien.id);
  }, [nhanVienPage]);
  const {open, isOpen, close} = useModal(false)
  const [currentNhanVien, setCurrentNhanVien] = useState<NhanVien>()

  const {selectAll, deselectAll, selectOne, deselectOne, selected} = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < nhanVienPage.content.length;
  const selectedAll = nhanVienPage.content.length > 0 && selected?.size === nhanVienPage.content.length;
  const EditIcon = icons.edit

  return (
    <Card>
      <Box sx={{overflowX: 'auto'}}>
        <Table sx={{minWidth: '800px'}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Họ Và Tên</TableCell>
              <TableCell>Năm Sinh</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Địa Chỉ</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nhanVienPage.content.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
                      <Avatar src={'/assets/avatar-6.png'}/>
                      <Typography variant="subtitle2">{row.hoVaTen}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.namSinh}</TableCell>
                  <TableCell>
                    {row.soDienThoai}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.diaChi}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setCurrentNhanVien(row)
                      open()
                    }}
                                edge="start"
                                color="info">
                      <EditIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider/>
      <TablePagination
        component="div"
        count={nhanVienPage.pageable.TotalCount}
        onPageChange={(event, page) => {
          onPageChange(page)
        }}
        page={nhanVienPage.pageable.CurrentPage - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[20]}
      />
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        onClose={() => {
          close()
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Chỉnh Sửa Nhân Viên</DialogTitle>
        <DialogContent dividers>
          {currentNhanVien &&
            <NhanVienEdit nhanVien={currentNhanVien}
                          triggerRefresh={() => {
                            close()
                            triggerRefresh()
                          }}
            />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
