import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/nextauth.config";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LoadingProvider } from "@/components/admin/LoadingProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

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
    <div className="min-h-screen font-rubik">
      <LoadingProvider>
        <SidebarProvider>
          <AdminSidebar user={session.user || {}} />
          <main className="flex-1 w-full min-h-screen flex flex-col bg-muted/20">
            <div className="p-4 border-b bg-background flex items-center shadow-sm lg:hidden">
              <SidebarTrigger />
              <span className="ml-4 font-semibold">Admin Panel</span>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex-1">
              {children}
            </div>
          </main>
          <Toaster />
        </SidebarProvider>
      </LoadingProvider>
    </div>
  );
}
