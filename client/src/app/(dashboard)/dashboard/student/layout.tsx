import { RoleGuard } from "@/components/auth/RoleGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["STUDENT", "ADMIN", "SUPER_ADMIN"]}>
      {children}
    </RoleGuard>
  );
}
