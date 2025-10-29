'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { saveToIndexedDB } from '@/lib/indexedDB';
import { STORE_NAMES } from '@/config/indexedDB.config';

interface AuthJotaiInitializerProps {
  initialUser?: User | null;
}

export default function AuthJotaiInitializer({ initialUser }: AuthJotaiInitializerProps) {
  const setUser = useSetAtom(userAtom);

  // const saveUserProfile = async (userId: string): Promise<void> => {
  //   await saveToIndexedDB(STORE_NAMES.USER_PROFILE, initialUser);
  // };

  useEffect(() => {
    const initialize = async () => {
      if (!initialUser) return;

      setUser(initialUser);

      if (initialUser.userId) {
        try {
          await saveToIndexedDB(STORE_NAMES.USER_PROFILE, initialUser);
        } catch (profileError) {
          console.error('UserProfile 로드 실패:', profileError);
        }
      }
    };

    initialize();
  }, [initialUser, setUser]);

  return null;
}
