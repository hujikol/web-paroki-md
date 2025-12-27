import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/nextauth.config";
import AdminNav from "@/components/admin/AdminNav";
import { LoadingProvider } from "@/components/admin/LoadingProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-brand-cream/30 font-rubik">
      <LoadingProvider>
        <AdminNav user={session.user || {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </main>
      </LoadingProvider>
    </div>
  );
}
