import { notFound } from "next/navigation";
import { AccountView } from "@/components/account/account-view";
import { ProtectedRoute } from "@/components/protected-route";

const validSections = ["tickets", "orders", "favorites", "settings"];

interface AccountSectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

export default async function AccountSectionPage({ params }: AccountSectionPageProps) {
  const { section } = await params;
  if (!validSections.includes(section)) notFound();
  const customerOnly = section === "tickets" || section === "orders" || section === "favorites";
  return <ProtectedRoute roles={customerOnly ? ["Customer"] : []}>
    <AccountView section={section} />
  </ProtectedRoute>;
}
