import { getAuthCookie } from '@/lib/auth';
import AuthJotaiInitializer from '@/components/auth/AuthJotaiInitializer';

interface ServerAuthProviderProps {
  children: React.ReactNode;
}

export default async function ServerAuthProvider({ children }: ServerAuthProviderProps) {
  const user = await getAuthCookie();

  return (
    <>
      <AuthJotaiInitializer initialUser={user} />
      {children}
    </>
  );
}
