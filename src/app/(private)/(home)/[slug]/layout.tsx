import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import Header from "@/components/header";
import HomeWrapper from "@/context/HomeWrapper";

export default async function StoreLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string };
}>) {
  const { slug } = await params;
  return (
    <HomeWrapper slug={slug}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </HomeWrapper>
  );
}
