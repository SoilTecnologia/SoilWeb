import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import NProgress from 'nprogress';

export default function withAuth(WrappedComponent) {
  return (props) => {
    const [session, loading] = useSession();
    const router = useRouter();

    if (typeof window !== 'undefined')
      if (loading) {
        return null;
      } else {
        if (!session) {
          router.push('/auth/signin');
          return null;
        }
      }

    return <WrappedComponent {...props} />;
  };
}
