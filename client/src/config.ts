import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_QLDT_BASE_URL
export const BACKEND_URL = `${process.env.NEXT_PUBLIC_QLDT_BASE_URL}/api`
export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: { name: 'Chẩn đoán xray', description: '', themeColor: '#090a0b', url: getSiteURL() },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};