import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StoreWrapper from "@/context/store-wrapper";

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Page Level Security
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <StoreWrapper ownerId={user.id}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </StoreWrapper>
  );
}
