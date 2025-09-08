import { Metadata } from "next";
import Login from "./Signup";
export const metadata: Metadata  = {
  title: 'Register in TaskNest',
  description: 'Create an account in TaskNest.',
};


export default function LoginPage() {
  return <Login />;
}