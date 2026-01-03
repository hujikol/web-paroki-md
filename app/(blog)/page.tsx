import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts } from "@/actions/posts";
import { getChurchStatistics, getScheduleEvents } from "@/lib/data";
import PostCard from "@/components/blog/PostCard";
import HeroCarousel from "@/components/home/HeroCarousel";
import JadwalMisaPreview from "@/components/home/JadwalMisaPreview";
import FormulirLinkSection from "@/components/home/FormulirLinkSection";
import DonationSection from "@/components/home/DonationSection";
import StatistikSection from "@/components/home/StatistikSection";

export const metadata: Metadata = {
  title: "Beranda | Paroki Brayut Santo Yohanes Paulus II",
  description: "Selamat datang di website resmi Paroki Brayut. Dapatkan informasi jadwal misa terbaru, warta paroki, berita kegiatan, dan profil gereja.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXTAUTH_URL,
    title: "Paroki Brayut Santo Yohanes Paulus II",
    description: "Website Resmi Paroki Brayut - Jadwal Misa, Berita, dan Kegiatan",
    siteName: "Paroki Brayut",
  },
};

export default async function HomePage() {
  let allPosts: Awaited<ReturnType<typeof getAllPosts>> = [];
  let churchStats = null;
  let upcomingEvents: any[] = [];

  try {
    allPosts = await getAllPosts();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  try {
    churchStats = await getChurchStatistics();
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }

  try {
    upcomingEvents = await getScheduleEvents();
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  const featuredPosts = allPosts.filter((post) => post.published).slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section - Infinite Carousel */}
      <HeroCarousel />

      {/* 2. Jadwal Misa - Main church schedule + CTAs */}
      <JadwalMisaPreview upcomingEvents={upcomingEvents} />

      {/* 3. Formulir Gereja - CTA Section */}
      <FormulirLinkSection />

      {/* 4. Warta Paroki - Latest News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <div>
            <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">Update Terbaru</span>
            <h2 className="text-3xl font-bold text-brand-dark mt-1">
              Warta Paroki
            </h2>
          </div>
          <Link
            href="/artikel"
            className="text-brand-blue hover:text-brand-darkBlue font-medium text-sm flex items-center gap-1 mb-1"
          >
            Lihat Semua <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada berita terbaru.</p>
          </div>
        )}
      </section>

      {/* 5. Statistik Paroki */}
      <StatistikSection stats={churchStats} />

      {/* 6. Donation Section - New church building */}
      <DonationSection />
    </div>
  );
}
