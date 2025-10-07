import { NavData, User } from "@/types/nav.type";
import {
  AudioWaveform,
  // BookOpen,
  Bot,
  Command,
  // LifeBuoy,
  // Send,
  // Settings2,
  SquareTerminal,
  Store,
} from "lucide-react";

// Simplified mock user for fallback, using the updated User type structure
export const initialMockUser: User = {
  id: "mock-user-id",
  name: "Mock User",
  email: "mock@stokwise.com",
  avatarUrl: "https://placehold.co/100x100/EBF5FF/3B82F6?text=M",
};

// Simplified initial NavData, focused only on static routes and mock teams
export const initialNavData: Omit<NavData, "user" | "navMain"> & {
  navMainStatic: NavData["navMain"];
} = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMainStatic: [
    { title: "Dashboard", url: "/dashboard", icon: SquareTerminal, items: [] },
    // Products and Stores will be dynamically generated, keeping placeholder here
    // { title: "Products", url: "/products", icon: Bot, items: [] },
    // { title: "Stores", url: "/stores", icon: Store, items: [] },
    // { title: "Reports", url: "/reports", icon: BookOpen, items: [] },
    // { title: "Settings", url: "/settings", icon: Settings2, items: [] },
  ],
};
