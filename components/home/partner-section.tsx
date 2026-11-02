import Link from "next/link";
import { ArrowRight, CheckCircle2, Calendar } from "lucide-react";
import { mockOrganizers } from "@/lib/mock/organizers";

export function PartnerSection() {
  const featuredPartners = mockOrganizers.slice(0, 6);

  return (
    <section className="container py-10 sm:py-12">
      <div className="mb-6 flex items-end justify-between sm:mb-7">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#2B212B] sm:text-2xl">
            Partner Organizers
          </h2>
          <p className="mt-1 text-xs font-normal text-[#8E8E8E] sm:text-sm">
            Discover curated experiences from verified event organizers on TixFlow
          </p>
        </div>
        <Link
          href="/events"
          className="group flex items-center gap-1.5 text-xs font-medium text-[#ef5360] transition-colors hover:text-[#ec3746] sm:text-sm"
        >
          <span>View All</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {featuredPartners.map((partner) => (
          <Link
            key={partner.id}
            href={`/events?q=${encodeURIComponent(partner.name)}`}
            className="group flex flex-col items-center rounded-xl border border-gray-200/75 bg-white p-4 text-center shadow-[0_2px_10px_rgba(17,15,28,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#ef5360]/30 hover:shadow-md"
          >
            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full border border-gray-100 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:border-[#ef5360]/40 sm:h-[72px] sm:w-[72px]">
              <img
                src={
                  partner.avatar ||
                  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop"
                }
                alt={partner.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {partner.verified && (
                <div
                  className="absolute bottom-0 right-0 rounded-full bg-white p-0.5 text-[#ef5360] shadow-sm"
                  title="Verified Organizer"
                >
                  <CheckCircle2 size={15} className="fill-[#ef5360] text-white" />
                </div>
              )}
            </div>

            <h3 className="line-clamp-1 w-full text-xs font-medium text-[#2B212B] transition-colors group-hover:text-[#ef5360] sm:text-[13.5px]">
              {partner.name}
            </h3>

            <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-normal text-[#8E8E8E]">
              <Calendar size={11} />
              <span>{partner.eventCount} Events</span>
            </div>

            <div className="mt-3.5 inline-flex w-full items-center justify-center rounded-full bg-[#F7F8FA] py-1.5 text-[11.5px] font-medium text-gray-600 transition-colors group-hover:bg-[#ef5360] group-hover:text-white">
              View Events
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
