"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
      <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {
        session ? (
          <p>Welcome back, {session.user?.name}!</p>
        ) : (
          <></>
        )
      }
    </div>
  );
}

