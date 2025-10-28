import { getAuthCookie } from '@/lib/auth';
import AuthJotaiInitializer from '@/components/auth/AuthJotaiInitializer';
import DarkModeInitializer from '@/components/DarkModeInitializer';

interface ServerAuthProviderProps {
  children: React.ReactNode;
}

export default async function ServerAuthProvider({ children }: ServerAuthProviderProps) {
  const user = await getAuthCookie();

  return (
    <>
      <AuthJotaiInitializer initialUser={user} />
      <DarkModeInitializer initialUser={user} />
      {children}
    </>
  );
}
