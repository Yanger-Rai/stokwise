import { NavData } from "@/types/nav.type";
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
export const initialNavData: NavData = {
  user: {
    name: "Yanger",
    email: "yanger@stockwise.com",
    avatar: "https://placehold.co/100x100/EBF5FF/3B82F6?text=Y",
  },
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
  navMain: [
    { title: "Dashboard", url: "/", icon: SquareTerminal, items: [] },
    {
      title: "Products",
      url: "/products",
      icon: Bot,
      // Categories will now be dynamically populated here
      items: [
        { title: "Low Stock", url: "/products/lowstock" },
        { title: "Cups", url: "/products/cups" },
        { title: "Plates", url: "/products/plates" },
        { title: "Rolls", url: "/products/rolls" },
      ],
    },
    {
      title: "Stores", // Added Stores
      url: "/stores",
      icon: Store,
      items: [
        { title: "Store A", url: "/stores/store-a" },
        { title: "Store B", url: "/stores/store-b" },
      ],
    },
    // { title: "Reports", url: "/reports", icon: BookOpen, items: [] },
    // { title: "Settings", url: "/settings", icon: Settings2, items: [] },
  ],
  // navSecondary: [
  //   { title: "Support", url: "#", icon: LifeBuoy },
  //   { title: "Feedback", url: "#", icon: Send },
  // ],
};
