import type { LucideIcon } from "lucide-react";

/**
 * Represents a user in the application.
 */
export type User = {
  name: string;
  email: string;
  avatar: string;
};

/**
 * Represents a sub-item in the main navigation.
 */
export type NavSubItem = {
  title: string;
  url: string;
};

/**
 * Represents an item in the main navigation.
 */
export type NavMainItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

/**
 * Represents an item in the team nav
 */

type teamItem = {
  name: string;
  logo: LucideIcon;
  plan: string;
};
/**
 * Represents the entire navigation data structure.
 */
export type NavData = {
  user: User;
  teams: teamItem[];
  navMain: NavMainItem[];
};
