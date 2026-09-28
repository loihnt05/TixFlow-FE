import { ProtectedRoute } from "@/components/protected-route";
import { CurrentUserProfile } from "@/components/current-user";

export default function AccountPage() {
  return <main><ProtectedRoute><CurrentUserProfile /></ProtectedRoute></main>;
}
