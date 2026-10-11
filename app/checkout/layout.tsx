import { ProtectedRoute } from "@/components/protected-route";

export default function CheckoutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProtectedRoute roles={["Customer"]}>{children}</ProtectedRoute>;
}
