import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — TixFlow",
  description: "Learn how TixFlow collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFD] py-12 sm:py-16">
      <div className="container max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ef5360] mb-2">
            <Lock size={16} />
            <span>Data Protection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B212B]">Privacy Policy</h1>
          <p className="mt-2 text-xs text-gray-500">Last updated: October 14, 2026</p>

          <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when registering an account, purchasing tickets, contacting support, or publishing an event. This includes your name, email address, phone number, and transaction records.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
              <p>
                Your personal data is used to issue digital tickets and QR admission codes, process secure payments, send order confirmations and event updates, and prevent fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">3. Information Sharing with Organizers</h2>
              <p>
                When you register or buy a ticket for an event, we share relevant attendee information (such as attendee name and ticket tier) with the verified organizer solely for admission and venue management purposes.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">4. Payment Security</h2>
              <p>
                All payment transactions are encrypted and processed through certified PCI-DSS compliant payment gateways. TixFlow does not store raw credit card numbers on its servers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">5. Your Rights</h2>
              <p>
                You have the right to request access to your personal data, request corrections, or request deletion of your account at any time by contacting our privacy team at{" "}
                <a href="mailto:privacy@tixflow.com" className="font-semibold text-[#ef5360] hover:underline">
                  privacy@tixflow.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
