import { notFound } from "next/navigation";
import { AccountView } from "@/components/account/account-view";

const validSections = ["tickets", "orders", "favorites", "settings"];
export default async function AccountSectionPage({ params }: PageProps<"/account/[section]">) {
  const { section } = await params;
  if (!validSections.includes(section)) notFound();
  return <AccountView section={section} />;
}
