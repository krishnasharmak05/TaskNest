'use client'
import React from 'react'
import Textfield from '../ui/Textfield'

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});


// Auth is in Light mode only
function Login() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center dark:bg-white dark:text-black">
            <h1 className="text-3xl font-[550]">Welcome to TaskNest</h1>
            <Textfield placeholder="Email" />
            <Textfield placeholder="Password" isPassword={true} />


            <button></button>
            <div className="my-4 flex items-center w-1/4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-2 text-gray-500 text-sm">or</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            <button 
                className="mt-4 px-2 py-3 w-1/4 border rounded hover:bg-gray-50"
                onClick={signIn('google')}
            >
                <div className='flex items-center justify-center'>
                    <img src="google.png" alt="Google Logo" width={20} height={20} style={{ marginRight: '8px' }} />
                    Continue with Google
                </div>
            </button>
        </div>
    )
}

export default Login
