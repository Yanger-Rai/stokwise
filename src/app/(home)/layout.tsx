import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import Header from "@/components/header";
import StoreWrapper from "@/components/store-wrapper";

export default function StoreLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { storeSlug: string };
}>) {
  return (
    <StoreWrapper storeSlug={params.storeSlug}>
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
