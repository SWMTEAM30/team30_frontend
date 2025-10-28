'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/atoms/authAtoms';
import { initializeUserSettings } from '@/lib/indexedDB';

interface DarkModeInitializerProps {
  initialUser?: User | null;
}

export default function DarkModeInitializer({ initialUser }: DarkModeInitializerProps) {
  const [isDarkMode, setIsDarkMode] = useAtom(darkModeAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  // 사용자 프로필에서 다크모드 설정 로드
  useEffect(() => {
    const loadDarkModeSettingFromDB = async () => {
      console.log('DarkModeInitializer: Loading dark mode setting for user:', initialUser);
      
      if (initialUser?.userId) {
        try {
          // 설정 초기화 (기존 설정이 있으면 로드, 없으면 기본값으로 초기화)
          const settings = await initializeUserSettings(initialUser.userId);
          console.log('DarkModeInitializer: Initialized settings:', settings);
          
          const isDarkMode = settings.theme === 'dark';
          console.log('DarkModeInitializer: Setting dark mode to:', isDarkMode);
          setIsDarkMode(isDarkMode);
        } catch (error) {
          console.error('DarkModeInitializer: Failed to initialize settings:', error);
          setIsDarkMode(false);
        }
      } else {
        console.log('DarkModeInitializer: No user ID, using default false');
        setIsDarkMode(false);
      }
      setIsInitialized(true);
    };

    loadDarkModeSettingFromDB();
  }, [initialUser, setIsDarkMode]);

  // 다크모드 상태에 따라 HTML 클래스 적용
  useEffect(() => {
    if (isInitialized) {
      console.log('DarkModeInitializer: Applying dark mode to HTML:', isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isInitialized]);

  return null; // 렌더링하지 않음
}
