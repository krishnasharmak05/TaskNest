

"use client"
import React from 'react'
import Textfield from '../ui/Textfield'
import Image from 'next/image';
import { signIn } from "next-auth/react"

async function signInWithEmailAndPassword(email?: string, password?: string) {
  if (!email) return alert("Email cannot be empty");
  if (!password) return alert("Password cannot be empty");
  if (email && password) {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        callbackUrl: "/",
        redirect: false
      });

      if ((res as any)?.error) {
        console.error((res as any).error);
        return Promise.reject(new Error((res as any).error || "Login failed"));
      }

      window.location.href = (res as any)?.url || '/';
      return Promise.resolve();
    } catch (_) {
      return Promise.reject(new Error("Login failed"));
    }
  } else
    return Promise.reject(new Error("Invalid email or password"));

}


// Auth is in Light mode only
export default function Login() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);

  return (
    <div>
      <div className='flex flex-row justify-end bg-white text-black px-4 pt-4'>
        <button className='bg-black text-white p-2 mx-2 rounded-lg hover:cursor-pointer'
          onClick={() => {
            window.location.href = '/signup';
          }}>Sign Up</button>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">
        <h1 className="text-3xl font-[550] pb-5">Welcome to TaskNest</h1>
        <form className="w-full max-w-sm flex flex-col items-center"
          onSubmit={async e => {
            e.preventDefault();
            try {
              await signInWithEmailAndPassword(email, password);
            } catch (_) {
              setError(true);
              await new Promise(r => setTimeout(r, 2000));
              setError(false);
            }
          }}
        >
          <Textfield placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
          <Textfield placeholder="Password" isPassword={true} onChange={(e) => setPassword(e.target.value)} />
          {
            error &&
            <div className="bg-red-100 w-full p-2">
              <p className=" text-red-400 text-sm">Invalid email or password</p>
            </div>
          }
          <button 
          className="mt-4 w-full px-4 py-3 border rounded-lg
           font-medium text-white bg-black cursor-pointer" 
           >Sign In</button>
        </form>
        <div className="my-4 flex items-center w-1/4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <button
          className="mt-4 px-2 w-full max-w-sm py-3 border rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => signIn('google')}
        >
          <div className='flex items-center justify-center font-medium'>
            <Image src="/google.png" alt="Google Logo" width={20} height={20} style={{ marginRight: '8px' }} />
            Continue with Google
          </div>
        </button>
      </div>
    </div>
  )
}
