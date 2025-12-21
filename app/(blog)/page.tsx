import Link from "next/link";
import { getAllPosts } from "@/actions/posts";
import PostCard from "@/components/blog/PostCard";

export default async function HomePage() {
  let allPosts: Awaited<ReturnType<typeof getAllPosts>> = [];
  
  try {
    allPosts = await getAllPosts();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
  
  const featuredPosts = allPosts.filter((post) => post.published).slice(0, 3);

  return (
    <div className="animate-fade-in pb-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-brand-dark/20">
        {/* Background Image Placeholder or Gradient */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548625361-e8755655761a?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-brand-dark/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-md">
            Selamat Datang di Website Resmi
          </h1>
          <p className="text-xl md:text-3xl font-light mb-8 opacity-90 drop-shadow-sm">
            Paroki Brayut - Santo Yohanes Paulus II
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/jadwal-misa"
              className="px-8 py-3 bg-brand-blue hover:bg-brand-darkBlue text-white font-medium rounded-full transition-colors shadow-lg"
            >
              Jadwal Misa
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-full border border-white/30 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Warta Terkini (Latest News) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <div>
            <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">Update Terbaru</span>
            <h2 className="text-3xl font-bold text-brand-dark mt-1">
              Warta Terkini
            </h2>
          </div>
          <Link
            href="/blog"
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

      {/* Pembangunan Gereja Section */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-200">
               {/* Placeholder for Church Building Image */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>
            
            <div className="space-y-6">
              <div>
                <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">Renovasi & Pembangunan</span>
                <h2 className="text-3xl font-bold text-brand-dark mt-2">
                  Pembangunan Gereja
                </h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-lg">
                Gereja Paroki Brayut saat ini sedang dalam proses renovasi dan pembangunan fasilitas penunjang untuk memberikan kenyamanan yang lebih baik bagi seluruh umat dalam beribadah dan berkegiatan.
              </p>
              
              <div className="bg-brand-cream/50 p-6 rounded-xl border border-brand-blue/10">
                <h3 className="font-bold text-brand-dark mb-2">Mari Berpartisipasi</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Dukungan doa dan dana dari Bapak/Ibu/Saudara/i sangat berarti bagi kelancaran pembangunan ini.
                </p>
                <Link
                  href="/contact" 
                  className="text-brand-blue font-medium hover:text-brand-darkBlue inline-flex items-center gap-2"
                >
                  Informasi Donasi <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
