

"use client"
import React from 'react'
import Textfield from '../ui/Textfield'
import Image from 'next/image';
import { signIn } from "next-auth/react"


function performValidationOfEmail(email: string) {
  if (!email) {
    alert("Email cannot be empty");
    return false;
  }
  return true;
}

function performValidationOfPassword(password: string) {
  if (!password) {
    alert("Password cannot be empty");
    return false;
  }
  return true;
}



async function signInWithEmailAndPassword(email?: string, password?: string, cnfPassword?: string) {
  if (!email) return Promise.reject(new Error("Email cannot be empty"));
  if (!password) return Promise.reject(new Error("Password cannot be empty"));
  if (!cnfPassword) return Promise.reject(new Error("Confirm Password cannot be empty"));
  const emailValid = performValidationOfEmail(email);
  const passwordValid = performValidationOfPassword(password);
  const passwordsMatch = password === cnfPassword;
  if(!passwordsMatch) return Promise.reject(new Error("Passwords do not match"));
  // TODO: Please check this logic
  if (emailValid && passwordValid) {
    // TODO: Signin is not done. This is still WIP.
        try {
          const res = await signIn('credentials', {
            email,
            password,
            callbackUrl: "/",
            redirect: false
          });
          
          if ((res as any)?.error) {
            console.error((res as any).error);  
            window.location.href = '/404';
            return Promise.reject(new Error((res as any).error || "Signup failed"));
          }

          window.location.href = (res as any)?.url || '/';
        } catch (_) {
          window.location.href = '/404';
          return Promise.reject(new Error("Signup failed"));
        }
      } else
        return Promise.reject(new Error("Invalid email or password"));
    }


// Auth is in Light mode only
export default function Signup() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [cnfPassword, setCnfPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

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
              await signInWithEmailAndPassword(email, password, cnfPassword);
            } catch (err) {
              setError(err instanceof Error ? err.message : String(err));
              await new Promise(r => setTimeout(r, 2000));
              setError(null);
            }
          }}
        >
          <Textfield placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
          <Textfield placeholder="Password" isPassword={true} onChange={(e) => setPassword(e.target.value)} />
          <Textfield placeholder="Confirm Password" isPassword={true} onChange={(e) => setCnfPassword(e.target.value)} />
          {
            error !== null &&
            <div className="bg-green-200 w-full p-2">
              <p className=" text-red-400 text-sm">{error}</p>
            </div>
          }
          <button className="mt-4 w-full px-4 py-3 border rounded-lg font-medium text-white bg-black cursor-pointer">Sign Up</button>
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
