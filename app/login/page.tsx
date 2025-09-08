import { Metadata } from "next";
import Login from "./Login";
export const metadata: Metadata  = {
  title: 'Login to TaskNest',
  description: 'Log in to your TaskNest account.',
};


export default function LoginPage() {
  return <Login />;
}