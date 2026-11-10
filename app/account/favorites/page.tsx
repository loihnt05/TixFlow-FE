import {
  AccountFavoritesSection,
  CustomerSectionGuard,
} from "@/components/account/account-sections";

export default function AccountFavoritesPage() {
  return (
    <CustomerSectionGuard>
      <AccountFavoritesSection />
    </CustomerSectionGuard>
  );
}
