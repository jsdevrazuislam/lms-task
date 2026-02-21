import { RoleGuard } from "@/components/auth/RoleGuard";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["SUPER_ADMIN"]}>{children}</RoleGuard>;
}
