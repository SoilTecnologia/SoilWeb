import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

export default function withAuth(WrappedComponent) {
  return (props) => {
    const [session, loading] = useSession();
    const router = useRouter();

    if (loading) {
      return null;
    } else {
      if (!session) {
        router.push('/auth/signin');
        return null;
      }
    }

    return <WrappedComponent {...props} token={session!.token} />;
  };
}
