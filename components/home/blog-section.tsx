"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen, User } from "lucide-react";

interface Author {
  name: string;
  avatar: string;
  role: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tab: "latest" | "organizer";
  author: Author;
  date: string;
  readTime: string;
}

const mockArticles: Article[] = [
  {
    id: "art-1",
    slug: "top-exhibitions-bangkok-2026",
    title: "10 นิทรรศการและอาร์ตแกลเลอรีในกรุงเทพฯ ที่ไม่ควรพลาดช่วงปลายปี 2026",
    excerpt: "รวมพิกัดงานศิลปะ เสพงานอาร์ต ถ่ายรูปสวย พร้อมตารางเวลาเดินทางและวิธีการจองบัตรล่วงหน้าฉบับอัปเดตล่าสุด",
    coverImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=80",
    category: "Art & Culture",
    tab: "latest",
    author: {
      name: "Nattha Karn",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      role: "Culture Editor",
    },
    date: "10 ต.ค. 2026",
    readTime: "5 นาที",
  },
  {
    id: "art-2",
    slug: "music-festival-guide-packing",
    title: "เตรียมตัวไปมิวสิคเฟสติวัลครั้งแรก Checklist อุปกรณ์สำคัญที่ต้องมี",
    excerpt: "คู่มือเอาตัวรอดสำหรับสายเฟส จัดกระเป๋าให้พร้อมเพื่อประสบการณ์ที่สนุกที่สุดตลอดทั้งคืน",
    coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
    category: "Festival",
    tab: "latest",
    author: {
      name: "TixFlow Music Team",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      role: "Music Specialist",
    },
    date: "08 ต.ค. 2026",
    readTime: "4 นาที",
  },
  {
    id: "art-3",
    slug: "indie-coffee-fair-highlight",
    title: "เปิดไฮไลต์ The Coffee & Culture Fair ชิมกาแฟสเปเชียลตี้จากทั่วเอเชีย",
    excerpt: "พบปะบาริสต้าชั้นนำและเวิร์กช็อป Cupping กาแฟแบบเจาะลึกตลอดสุดสัปดาห์ใจกลางเมือง",
    coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
    category: "Food & Drink",
    tab: "latest",
    author: {
      name: "Sira Wong",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      role: "Lifestyle Writer",
    },
    date: "05 ต.ค. 2026",
    readTime: "3 นาที",
  },
  {
    id: "art-4",
    slug: "tech-trends-southeast-asia-2026",
    title: "เจาะเทรนด์เทคโนโลยี AI & Cloud ในงาน Vietnam Future Forum",
    excerpt: "สรุปประเด็นสำคัญและทิศทางอุตสาหกรรมเทคสตาร์ทอัพในภูมิภาคเอเชียตะวันออกเฉียงใต้",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    category: "Technology",
    tab: "latest",
    author: {
      name: "Anan Tech",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
      role: "Tech Reporter",
    },
    date: "02 ต.ค. 2026",
    readTime: "6 นาที",
  },
  {
    id: "art-5",
    slug: "organizer-guide-ticket-pricing",
    title: "กลยุทธ์การตั้งราคาบัตร Early Bird ให้บัตร Sold Out ภายใน 24 ชม.",
    excerpt: "เทคนิคคำนวณต้นทุน จิตวิทยาการตั้งราคา และการปล่อยบัตรแต่ละรอบอย่างมีประสิทธิภาพสูงสุด",
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
    category: "Organizer Tips",
    tab: "organizer",
    author: {
      name: "TixFlow Operations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      role: "Event Strategist",
    },
    date: "09 ต.ค. 2026",
    readTime: "7 นาที",
  },
  {
    id: "art-6",
    slug: "organizer-checkin-system-qr",
    title: "ระบบ Check-in หน้างานด้วย QR Code ลดคิวแออัดได้อย่างไร?",
    excerpt: "วิธีใช้งานเครื่องสแกนบัตร TixFlow และการจัดการระบบสำรองออฟไลน์เพื่อความราบรื่นหน้างาน",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    category: "Operations",
    tab: "organizer",
    author: {
      name: "Chaiyaporn D.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      role: "Technical Lead",
    },
    date: "06 ต.ค. 2026",
    readTime: "4 นาที",
  },
  {
    id: "art-7",
    slug: "organizer-event-marketing-playbook",
    title: "Playbook การโปรโมตอีเวนต์บนโซเชียลมีเดียให้เข้าถึงกลุ่มเป้าหมาย",
    excerpt: "แนวทางการทำคอนเทนต์ ยิงแอด และการเลือกใช้อินฟลูเอนเซอร์ช่วยโปรโมตอย่างคุ้มค่า",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    category: "Marketing",
    tab: "organizer",
    author: {
      name: "Ploy Pim",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      role: "Growth Marketer",
    },
    date: "03 ต.ค. 2026",
    readTime: "5 นาที",
  },
  {
    id: "art-8",
    slug: "organizer-hybrid-events-streaming",
    title: "จัดอีเวนต์แบบ Hybrid ให้ผู้เข้าร่วมทั้ง Onsite และ Online มีส่วนร่วม",
    excerpt: "รวมเครื่องมือระบบเสียง วิดีโอสตรีมมิ่งคุณภาพสูง และกิจกรรม Interactive ตลอดงาน",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    category: "Production",
    tab: "organizer",
    author: {
      name: "Korn V.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      role: "Live Production Lead",
    },
    date: "01 ต.ค. 2026",
    readTime: "5 นาที",
  },
];

export function BlogSection() {
  const [activeTab, setActiveTab] = useState<"latest" | "organizer">("latest");

  const filtered = mockArticles.filter((art) => art.tab === activeTab);
  const featuredArticle = filtered[0];
  const sideArticles = filtered.slice(1, 4);

  return (
    <section className="w-full bg-[#F6F7F9] border-y border-gray-200/60 py-12 sm:py-16">
      <div className="container">
        {/* Section Header with Tabs */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ef5360]">
              <BookOpen size={14} />
              <span>Latest Articles</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2B212B] sm:text-2xl md:text-[26px]">
              บทความและเรื่องราวน่าสนใจ
            </h2>
            <p className="mt-1 text-xs text-[#8E8E8E] sm:text-sm">
              อัปเดตข่าวสาร เทรนด์อีเวนต์ และไอเดียใหม่ๆ ในวงการ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tab Toggle */}
            <div className="flex items-center gap-1.5 rounded-full bg-white p-1 border border-gray-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("latest")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeTab === "latest"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                บทความล่าสุด
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("organizer")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeTab === "organizer"
                    ? "bg-[#ef5360] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                คู่มือสำหรับผู้จัด
              </button>
            </div>

            {/* View All Link */}
            <Link
              href="/articles"
              className="group hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#ef5360] transition-colors hover:text-[#ec3746] sm:text-sm"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Asymmetrical Grid: Left Featured (7 cols) + Right 3 Articles (5 cols) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
          {/* 1. Featured Article Card (Left) */}
          {featuredArticle && (
            <div className="lg:col-span-7 flex">
              <Link
                href={`#article-${featuredArticle.slug}`}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
              >
                {/* 1. Article Image with Cover & Subtle Zoom */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Category Pill Tag */}
                  <div className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 rounded-full bg-[#ef5360] px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {featuredArticle.category}
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 md:p-7 bg-white">
                  <div>
                    {/* 2. Article Title */}
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] line-clamp-2">
                      {featuredArticle.title}
                    </h3>

                    {/* 3. Author Info */}
                    <div className="mt-3.5 flex items-center gap-2.5">
                      <img
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-900 group-hover:text-[#ef5360] transition-colors">
                          {featuredArticle.author.name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{featuredArticle.author.role}</span>
                      </div>
                    </div>

                    {/* 4. Date & Metadata */}
                    <div className="mt-2.5 flex items-center gap-3 text-xs text-[#8E8E8E]">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#ef5360]" />
                        <span>{featuredArticle.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#ef5360]" />
                        <span>อ่าน {featuredArticle.readTime}</span>
                      </span>
                    </div>

                    {/* 5. Supporting Information (Excerpt) */}
                    <p className="mt-3.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#6B7280]">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ef5360] group-hover:text-[#ec3746]">
                    <span>อ่านบทความต่อ</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* 2. Three Smaller Article Cards (Right, Stacked Vertically) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`#article-${article.slug}`}
                className="group relative flex h-full items-center gap-3.5 sm:gap-4 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ef5360]"
              >
                {/* 1. Article Image Thumbnail */}
                <div className="relative aspect-[4/3] w-28 sm:w-36 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Content Area */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    {/* Supporting Category Badge */}
                    <span className="inline-block rounded-full bg-[#FFEFF0] px-2.5 py-0.5 text-[10px] font-semibold text-[#ef5360]">
                      {article.category}
                    </span>

                    {/* 2. Article Title */}
                    <h4 className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-bold text-[#2B212B] transition-colors duration-200 group-hover:text-[#ef5360] leading-snug">
                      {article.title}
                    </h4>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-1">
                    {/* 3. Author */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="h-4 w-4 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <span className="font-medium truncate group-hover:text-[#ef5360] transition-colors">
                        {article.author.name}
                      </span>
                    </div>

                    {/* 4. Date & Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E]">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ef5360] hover:text-[#ec3746]"
          >
            <span>ดูบทความทั้งหมด</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
