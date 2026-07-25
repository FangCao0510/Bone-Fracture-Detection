import type {Icon} from '@phosphor-icons/react/dist/lib/types';
import {ChartPie as ChartPieIcon} from '@phosphor-icons/react/dist/ssr/ChartPie';
import {GearSix as GearSixIcon} from '@phosphor-icons/react/dist/ssr/GearSix';
import {PlugsConnected as PlugsConnectedIcon} from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import {User as UserIcon} from '@phosphor-icons/react/dist/ssr/User';
import {Users as UsersIcon} from '@phosphor-icons/react/dist/ssr/Users';
import {XSquare} from '@phosphor-icons/react/dist/ssr/XSquare';
import {Files as FilesIcon} from "@phosphor-icons/react/dist/ssr/Files";
import {FileCloud as FileCloud} from "@phosphor-icons/react/dist/ssr/FileCloud";
import {Bookmark, Books, Broadcast, Info, PencilSimple, Trash} from "@phosphor-icons/react";

export const icons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  books: Books,
  bookmark: Bookmark,
  broadcast: Broadcast,
  user: UserIcon,
  users: UsersIcon,
  files: FilesIcon,
  fileCloud: FileCloud,
  edit: PencilSimple,
  delete: Trash,
  detail: Info
} as Record<string, Icon>;
