import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'benhnhan', title: 'Bệnh nhân', href: paths.quanLyDaoTao.benhNhan, icon: 'x-square' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'chandoanbenhnhan', title: 'Chẩn đoán bệnh nhân', href: paths.quanLyDaoTao.Patient, icon: 'x-square' },
  { key: 'nhanvien', title: 'Nhân viên', href: paths.quanLyDaoTao.staffs, icon: 'users' },
   { key: 'account', title: 'Hồ Sơ Cá Nhân', href: paths.quanLyDaoTao.account, icon: 'user'},
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
