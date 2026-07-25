'use client';

import * as React from 'react';

import type {User} from '@/types/user';
import {authClient} from '@/lib/auth/client';
import {useRouter} from "next/navigation";

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({children}: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });
  const router = useRouter()

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const {data, error} = await authClient.getUser();

      if (error) {
        setState((prev) => ({...prev, user: null, error, isLoading: false}));
        router.push('/auth/sign-in')
        return;
      }

      setState((prev) => ({...prev, user: data ?? null, error: null, isLoading: false}));
    } catch (err) {
      setState((prev) => ({...prev, user: null, error: 'Something went wrong', isLoading: false}));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch(() => {
      router.push('/auth/sign-in')
    });
  }, []);

  return <UserContext.Provider value={{...state, checkSession}}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
