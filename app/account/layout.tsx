import { ProtectedRoute } from "@/components/protected-route";
import { AccountShell } from "@/components/account/account-shell";

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <AccountShell>{children}</AccountShell>
    </ProtectedRoute>
  );
}
