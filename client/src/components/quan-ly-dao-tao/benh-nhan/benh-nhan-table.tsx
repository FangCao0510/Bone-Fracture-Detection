"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {useSelection} from '@/hooks/use-selection';
import {icons} from "@/components/quan-ly-dao-tao/layout/icons";
import IconButton from "@mui/material/IconButton";
import {Transition} from "@/components/modal/form-modal";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import {useModal} from "@/hooks/use-modal";
import {BenhNhanPage, BenhNhanView} from "@/lib/axios/model/benh-nhan";
import dayjs from "dayjs";
import {BenhNhanDetailModal} from "@/components/quan-ly-dao-tao/benh-nhan/benh-nhan-detail";
import {BenhNhanEditModal} from "@/components/quan-ly-dao-tao/benh-nhan/benh-nhan-edit";

interface BenhNhanTableProps {
  benhNhanPage: BenhNhanPage;
  rowsPerPage?: number;
  triggerRefresh?: () => void;
  onPageChange: (page: number) => void;
}

export function BenhNhanTable({
                              benhNhanPage,
                              rowsPerPage = 0,
                              triggerRefresh,
                              onPageChange
                            }: BenhNhanTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return benhNhanPage.content.map((l) => l.id);
  }, [benhNhanPage]);
  const {selectAll, deselectAll, selectOne, deselectOne, selected} = useSelection(rowIds);
  const [currentBenhNhan, setCurrentBenhNhan] = React.useState<BenhNhanView>();
  const {open: openEditModal, isOpen: isEditModalOpen, close: closeEditModal} = useModal(false)
  const {open: openDetailModal, isOpen: isDetailModalOpen, close: closeDetailModal} = useModal(false)
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < benhNhanPage.content.length;
  const selectedAll = benhNhanPage.content.length > 0 && selected?.size === benhNhanPage.content.length;
  const DetailIcon = icons.detail
  const EditIcon = icons.edit
  
  return (
    <>
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
                <TableCell>Tên bệnh nhân</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Ngày tiếp nhận</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {benhNhanPage.content.map((row) => {
                console.log("row data:", row);
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
                      {row.tenBenhNhan}
                    </TableCell>
                    <TableCell>{dayjs(row.ngaySinh).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{dayjs(row.ngayTao).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{row.gioiTinh}</TableCell>
                    <TableCell>{row.soDienThoai}</TableCell>
                    <TableCell>{row.diaChiChiTiet}</TableCell>
                    <TableCell>
                      <IconButton edge="start" color="info"
                                  onClick={() => {
                                    openDetailModal()
                                    setCurrentBenhNhan(row)
                                  }}>
                        <DetailIcon/>
                      </IconButton>
                      <IconButton edge="start"
                                  color="info"
                                  onClick={() => {
                                    openEditModal()
                                    setCurrentBenhNhan(row)
                                  }}>
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
          count={benhNhanPage.pageable.TotalCount}
          onPageChange={(event, page) => {
            onPageChange(page)
          }}
          page={benhNhanPage.pageable.CurrentPage - 1}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[20]}
        />
      </Card>
      <Dialog
        open={isDetailModalOpen}
        TransitionComponent={Transition}
        onClose={closeDetailModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Chi Tiết bệnh nhân</DialogTitle>
        <DialogContent dividers>
          {currentBenhNhan &&
            <BenhNhanDetailModal benhNhan={currentBenhNhan}
            />
          }
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditModalOpen}
        TransitionComponent={Transition}
        onClose={closeEditModal}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Chỉnh Sửa bệnh nhân</DialogTitle>
        <DialogContent dividers>
          {currentBenhNhan &&
            <BenhNhanEditModal benhNhan={currentBenhNhan}
                             afterSubmit={() => {
                               closeEditModal()
                               triggerRefresh?.()
                             }}
            />
          }
        </DialogContent>
      </Dialog>
    </>

  );
}
