import Header from "@/components/blog/Header";
import Footer from "@/components/blog/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-rubik">
      <Header />
      {/* Add padding top to account for fixed header (h-20 = 5rem) */}
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
