'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import {usePathname} from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type {NavItemConfig} from '@/types/nav';
import {paths} from '@/paths';
import {isNavItemActive} from '@/lib/is-nav-item-active';
import {Logo} from '@/components/core/logo';

import {navItems} from './config';
import {icons} from './icons';
import {useUser} from "@/hooks/use-user";
import {Collapse} from "@mui/material";
import List from "@mui/material/List";
import {CaretDown, CaretUp} from "@phosphor-icons/react";

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const {user} = useUser()
  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: {xs: 'none', lg: 'flex'},
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': {display: 'none'},
      }}
    >
      <Stack spacing={2} sx={{p: 3}}>
        <Box component={RouterLink} href={paths.home} sx={{display: 'inline-flex', paddingLeft: '2rem'}}>
          <Logo height={60}/>
        </Box>
      </Stack>
      <Divider sx={{borderColor: 'var(--mui-palette-neutral-700)'}}/>
      <Box component="nav" sx={{flex: '1 1 auto', p: '12px'}}>
        {renderNavItems({pathname, items: navItems, roles: user?.roles})}
      </Box>
      <Divider sx={{borderColor: 'var(--mui-palette-neutral-700)'}}/>
    </Box>
  );
}

function renderNavItems({items = [], pathname, roles}: {
  items?: NavItemConfig[];
  pathname: string,
  roles?: string[]
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const {key, ...item} = curr;
    const disabled = checkDisabled(item.rolesToEnable, roles)
    acc.push(<NavItem disabled={disabled} key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{listStyle: 'none', m: 0, p: 0}}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends NavItemConfig {
  pathname: string;
}

function NavItem({
                   disabled,
                   external,
                   href,
                   icon,
                   matcher,
                   pathname,
                   title,
                   items,
                   rolesToEnable
                 }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({disabled, external, href, matcher, pathname});
  const Icon = icon ? icons[icon] : null;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  return (
    <li>
      <Box
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href: disabled ? '#' : href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : {role: 'button'})}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && {bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)'}),
        }}
      >
        <Box sx={{alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto'}}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box
          onClick={handleClick}
          sx={{flex: '1 1 auto'}}>
          <Typography
            component="div"
            sx={{
              color: 'inherit', fontSize: '0.875rem',
              fontWeight: 500, lineHeight: '28px', display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            {title}
            {items && open &&
              <CaretUp
                fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                fontSize="var(--icon-fontSize-md)"
                weight={active ? 'fill' : undefined}
              />
            }
            {items && !open &&
              <CaretDown
                fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                fontSize="var(--icon-fontSize-md)"
                weight={active ? 'fill' : undefined}
              />}
          </Typography>
        </Box>
      </Box>
      {items &&
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" sx={{paddingLeft: '20px'}}>
            {renderNavItems({pathname, items, roles: rolesToEnable})}
          </List>
        </Collapse>
      }
    </li>
  );
}

function checkDisabled(rolesToEnable?: string[], currentUserRoles?: string[]): boolean {
  if (!rolesToEnable) {
    return false
  }
  if (!currentUserRoles) {
    return true
  }
  return !rolesToEnable.every((role) => currentUserRoles?.some(cRole => cRole.toLowerCase() === role.toLowerCase()))
}
