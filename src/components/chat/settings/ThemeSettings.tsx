'use client';

import { Settings, Moon, Sun } from 'lucide-react';
import { useAtom } from 'jotai';
import { darkModeAtom, userAtom } from '@/atoms/authAtoms';
import { saveDarkModeSetting } from '@/lib/indexedDB';

export default function ThemeSettings() {
  const [isDarkMode, setIsDarkMode] = useAtom(darkModeAtom);
  const [user] = useAtom(userAtom);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // 다크모드 설정을 별도 스토어에 저장
    if (user?.userId) {
      try {
        await saveDarkModeSetting(user.userId, newDarkMode);
        console.log('Successfully saved dark mode setting:', newDarkMode);
      } catch (error) {
        console.error('Failed to save dark mode setting:', error);
      }
    } else {
      console.warn('No user ID available for saving dark mode setting');
    }
  };

  console.log('ThemeSettings render - isDarkMode:', isDarkMode);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Settings className="h-4 w-4" />
        테마 설정
      </div>
      <div className="pl-6">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{isDarkMode ? '라이트 모드' : '다크 모드'}</span>
        </button>
      </div>
    </div>
  );
}
