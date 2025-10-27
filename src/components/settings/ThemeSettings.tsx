'use client';

import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import { Settings } from 'lucide-react';
import { saveUserProfile } from '@/lib/indexedDB';
import { useCallback } from 'react';

export default function ThemeSettings() {
  const [user, setUser] = useAtom(userAtom);

  const handleDarkModeToggle = useCallback(async () => {
    if (user) {
      const newProfile: User = {
        ...user,
        darkMode: !user?.darkMode,
      };

      setUser(newProfile);
      await saveUserProfile(newProfile);
    }
  }, [user, setUser]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Settings className="h-4 w-4" />
        테마 설정
      </div>
      <div className="pl-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={user?.darkMode || false}
            onChange={handleDarkModeToggle}
            className="rounded border-gray-300"
          />
          <span className="text-sm">다크 모드</span>
        </label>
      </div>
    </div>
  );
}
