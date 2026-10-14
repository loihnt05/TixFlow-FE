import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — TixFlow",
  description: "Terms and conditions governing the use of the TixFlow ticketing platform and services.",
};

export default function TermsPage() {
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
            <Shield size={16} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B212B]">Terms of Service</h1>
          <p className="mt-2 text-xs text-gray-500">Last updated: October 14, 2026</p>

          <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the TixFlow ticketing platform (&ldquo;TixFlow&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">2. Event Ticketing &amp; Purchases</h2>
              <p>
                TixFlow acts as an authorized ticketing and registration service provider for event organizers. All ticket sales are subject to availability and the specific admission policies set forth by the respective event organizer.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">3. Refunds &amp; Cancellations</h2>
              <p>
                Unless explicitly stated otherwise by the organizer or required by applicable consumer protection laws, all ticket orders are final. In the event of a cancellation or rescheduling, refunds will be processed in accordance with the organizer&apos;s published policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">4. User Accounts &amp; Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">5. Organizer Obligations</h2>
              <p>
                Organizers publishing events on TixFlow warrant that all event descriptions, ticket pricing, and venue details are accurate and that they hold all required permits and rights to host the published events.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-gray-900 mb-2">6. Contact Information</h2>
              <p>
                For questions regarding these Terms, please contact our support desk at{" "}
                <a href="mailto:support@tixflow.com" className="font-semibold text-[#ef5360] hover:underline">
                  support@tixflow.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
