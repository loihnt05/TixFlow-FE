"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  Clock,
  Ticket,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useKeycloakAuth } from "@/components/auth-provider";

export function Footer() {
  const auth = useKeycloakAuth();
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const isCustomer = auth.roles.includes("Customer");
  const isOrganizer = auth.roles.includes("Organizer");
  const isAdmin = auth.roles.includes("Admin");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribedEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      {/* Main Footer Container */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Contact & Socials (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" aria-label="TixFlow home" className="inline-flex items-center gap-2 group">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ef5360] text-white shadow-md">
                <Ticket size={18} strokeWidth={2.4} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Tix<span className="text-[#ef5360]">Flow</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-gray-300 max-w-sm">
              68 Innovation Way, Phaya Thai, Bangkok 10400<br />
              Empowering organizers &amp; attendees with seamless event ticketing, registration, and memorable live experiences.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
              >
                <span className="text-sm font-bold">in</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="X / Twitter"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="YouTube"
              >
                <span className="text-sm font-bold">▶</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="TikTok"
              >
                <span className="text-sm font-bold">♪</span>
              </a>
            </div>

            {/* Mobile App Download badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/30 transition-colors"
              >
                <span className="text-lg"></span>
                <div className="text-left">
                  <div className="text-[9px] text-gray-400 uppercase leading-none">Download on the</div>
                  <div className="text-xs font-bold text-white leading-tight">App Store</div>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/30 transition-colors"
              >
                <span className="text-sm">▶</span>
                <div className="text-left">
                  <div className="text-[9px] text-gray-400 uppercase leading-none">Get it on</div>
                  <div className="text-xs font-bold text-white leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols on lg) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">TixFlow</h3>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <Link href="/events" className="hover:text-white transition-colors">
                    Explore Events
                  </Link>
                </li>
                <li>
                  <Link href="/events?filter=store" className="hover:text-white transition-colors">
                    Store
                  </Link>
                </li>
                {(isOrganizer || !auth.authenticated) && <li>
                    <Link href="/organizer" className="hover:text-white transition-colors">
                      For Organizers
                    </Link>
                  </li>}
                {isOrganizer && <li>
                    <Link href="/organizer/events/create" className="hover:text-white transition-colors">
                      Create Event
                    </Link>
                  </li>}
                {isCustomer && <li>
                    <Link href="/account/tickets" className="hover:text-white transition-colors">
                      My Tickets
                    </Link>
                  </li>}
                {isAdmin && <li>
                    <Link href="/admin" className="hover:text-white transition-colors">
                      Admin Dashboard
                    </Link>
                  </li>}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Articles</h3>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li>
                  <Link href="/articles" className="hover:text-white transition-colors">
                    Latest Stories
                  </Link>
                </li>
                <li>
                  <Link href="/articles?tab=organizer" className="hover:text-white transition-colors">
                    Organizer Guides
                  </Link>
                </li>
                <li>
                  <Link href="/articles?category=Marketing" className="hover:text-white transition-colors">
                    Event Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/articles?category=Technology" className="hover:text-white transition-colors">
                    Tech &amp; Insights
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter & Help Center (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                Subscribe for Updates
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Be the first to know about trending concerts, summits, festivals, and exclusive ticket presales.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-10 px-3.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#ef5360] focus:bg-white/15"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#ef5360] hover:bg-[#ec3746] text-white font-bold text-xs flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  {subscribed ? <CheckCircle2 size={16} /> : <Send size={15} />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Thank you for subscribing to TixFlow!
                </p>
              )}
            </div>

            <div className="pt-2 text-xs text-gray-300 space-y-1.5 border-t border-white/10">
              <p className="text-gray-400">Have questions or suggestions? Contact our team:</p>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[#ef5360]" />
                <a href="mailto:support@tixflow.com" className="text-white hover:underline">
                  support@tixflow.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-[#ef5360]" />
                <span className="text-white">Call Center: 02 038 5150</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-[#ef5360]" />
                <span className="text-gray-400">Monday - Friday: 10:00 - 18:00 (UTC+7)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-black/30 py-4 text-xs text-gray-400">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            Copyright &copy; {new Date().getFullYear()} TixFlow Co., Ltd. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/organizer" className="hover:text-white transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
