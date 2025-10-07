import GlobalWrapper from "@/context/GlobalWrapper";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
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

  return <GlobalWrapper ownerId={user.id}>{children}</GlobalWrapper>;
}
