import { ProtectedRoute } from "@/components/protected-route";

export default function OrganizerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProtectedRoute roles={["Organizer"]}>{children}</ProtectedRoute>;
}
