"use client"

import { useSession, signOut } from "next-auth/react";



export default function Dashboard() {
    const { data: session, status } = useSession();
    if(status === 'unauthenticated') console.log("User is not authenticated. Redirecting to login...");
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Sign Out
                    </button>
                </div>

                {session?.user && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">User Information</h2>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {session.user.name || 'Not provided'}</p>
                            <p><strong>Email:</strong> {session.user.email}</p>
                            <p><strong>ID:</strong> {session.user.id}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}