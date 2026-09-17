import {
  Zap,
  Wrench,
  Hammer,
  PaintRoller,
  Flame,
  Bricks,
  Car,
  Smartphone,
  Laptop,
  Fuel,
  Snowflake,
  Sparkles,
  Scissors,
  Cog,
  type LucideIcon,
} from "lucide-react";

// Maps ServiceCategory.iconName (a plain string in the database) to an
// actual icon component. Falls back gracefully if a future admin-added
// category doesn't have a matching icon yet.
const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Wrench,
  Hammer,
  PaintRoller,
  Flame,
  Bricks,
  Car,
  Smartphone,
  Laptop,
  Fuel,
  Snowflake,
  Sparkles,
  Scissors,
  Cog,
};

export function categoryIcon(iconName: string | null | undefined): LucideIcon {
  return (iconName && ICON_MAP[iconName]) || Wrench;
}
