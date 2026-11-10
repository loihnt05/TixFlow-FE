import {
  AccountOrdersSection,
  CustomerSectionGuard,
} from "@/components/account/account-sections";

export default function AccountOrdersPage() {
  return (
    <CustomerSectionGuard>
      <AccountOrdersSection />
    </CustomerSectionGuard>
  );
}
