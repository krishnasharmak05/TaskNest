"use client"

import React from "react";
import Textfield from "../ui/Textfield";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function validateEmail(email: string) {
  if (!email) return "Email cannot be empty";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address";
  return null;
}

function validatePassword(password: string) {
  if (!password) return "Password cannot be empty";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [cnfPassword, setCnfPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setError(emailErr || passErr);
      return;
    }
    if (password !== cnfPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Signup failed");
        return;
      }

      // in your client component before signIn
      const callbackUrl = `${window.location.origin}/`;
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });


      if (result?.error) {
        setError(result.error);
        return;
      }
      if (!result) {
        setError("No response from signIn");
        return;
      }

      router.push(result.url ?? "/");

      // If signIn returned a url, prefer it (and ensure it's absolute); otherwise fallback to "/"
      const target = (result?.url && typeof result.url === "string")
        ? (result.url.startsWith("/") ? `${window.location.origin}${result.url}` : result.url)
        : `${window.location.origin}/`;

      router.push(target);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-end bg-white text-black px-4 pt-4">
        <button
          className="bg-black text-white p-2 mx-2 rounded-lg hover:cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">
        <h1 className="text-3xl font-[550] pb-5">Welcome to TaskNest</h1>
        <form
          className="w-full max-w-sm flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <Textfield
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
          <Textfield
            placeholder="Password"
            isPassword={true}
            value={password}
            onChange={(e) =>
              setPassword((e.target as HTMLInputElement).value)
            }
          />
          <Textfield
            placeholder="Confirm Password"
            isPassword={true}
            value={cnfPassword}
            onChange={(e) =>
              setCnfPassword((e.target as HTMLInputElement).value)
            }
          />
          {error && (
            <div className="bg-red-100 w-full p-2 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            className="mt-4 w-full px-4 py-3 border rounded-lg font-medium text-white bg-black cursor-pointer"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="my-4 flex items-center w-1/4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          className="mt-4 px-2 w-full max-w-sm py-3 border rounded-lg hover:bg-gray-200 cursor-pointer"
          disabled={loading}
          onClick={() => signIn("google")}
        >
          <div className="flex items-center justify-center font-medium">
            <Image
              src="/google.png"
              alt="Google Logo"
              width={20}
              height={20}
              style={{ marginRight: "8px" }}
            />
            Continue with Google
          </div>
        </button>
      </div>
    </div>
  );
}
