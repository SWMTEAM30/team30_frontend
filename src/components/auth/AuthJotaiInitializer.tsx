'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';

interface AuthJotaiInitializerProps {
  initialUser?: User | null;
}

export default function AuthJotaiInitializer({ initialUser }: AuthJotaiInitializerProps) {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    if (initialUser) setUser(initialUser);
  }, [initialUser, setUser]);

  return null;
}
