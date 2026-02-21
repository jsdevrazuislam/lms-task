import { Metadata } from "next";
import UsersClient from "./UsersClient";

export const metadata: Metadata = {
  title: "User Management | Admin | LMS Platform",
  description:
    "Manage system users, adjust roles, and monitor account statuses across the platform.",
};

export default function UsersPage() {
  return <UsersClient />;
}
