import {
  AccountTicketsSection,
  CustomerSectionGuard,
} from "@/components/account/account-sections";

export default function AccountTicketsPage() {
  return (
    <CustomerSectionGuard>
      <AccountTicketsSection />
    </CustomerSectionGuard>
  );
}
