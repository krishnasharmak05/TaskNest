"use client"

import { signOut, useSession } from "next-auth/react";
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
          <div className="w-screen h-screen p-4 relative">
          <button className="bg-blue-500 absolute top-0 right-0 rounded p-2 m-2 cursor-pointer" onClick={() => signOut()}>Sign out</button>
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Welcome back, {session.user?.name}!</p>
          </div>
        ) : (
          <></>
        )
      }
    </div>
  );
}