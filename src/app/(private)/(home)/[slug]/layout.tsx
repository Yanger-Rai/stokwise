import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import Header from "@/components/header";
// import HomeWrapper from "@/context/HomeWrapper";

export default async function StoreLayout({
  children,
}: // params,
Readonly<{
  children: React.ReactNode;
  // params: { slug: string };
}>) {
  /**
   * Commented out the params as it was causing a bug on business switcher
   * causing the categories to be fetch incorrectly
   *
   * !! A guard clause to update zustant if user manually changes the url slug of the business
   */
  // const { slug } = await params;
  return (
    // <HomeWrapper slug={slug}>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
    // </HomeWrapper>
  );
}
