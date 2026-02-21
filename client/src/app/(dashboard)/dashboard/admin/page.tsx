import { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | LMS Platform",
  description:
    "Monitor platform metrics, user activity, and course performance in real-time.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
