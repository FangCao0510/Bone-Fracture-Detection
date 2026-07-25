'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import {useColorScheme} from '@mui/material/styles';

import {NoSsr} from '@/components/core/no-ssr';

const HEIGHT = 150;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
  name?: 'cdc' | 'kcl';
}

export function Logo({height = HEIGHT, width, name = 'cdc'}: LogoProps): React.JSX.Element {
  const url = name === 'cdc' ? '/assets/logo_cdc.png' : '/assets/logo_kcl.jpg';
  const calculatedWith = width ? width : "auto"
  return <Box alt="logo" component="img" height={height} width={calculatedWith} src={url}/>;
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
                              colorDark = 'light',
                              colorLight = 'dark',
                              height = HEIGHT,
                              ...props
                            }: DynamicLogoProps): React.JSX.Element {
  const {colorScheme} = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{height: `${height}px`}}/>}>
      <Logo color={color} height={height} {...props} emblem/>
    </NoSsr>
  );
}
