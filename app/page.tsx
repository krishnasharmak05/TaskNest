import Home from "./home/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskNest",
  description: "A task management application",
};

export default function Page() {
  return (
    <Home />
  );
}
