import { LayoutDashboard, History, Languages, Settings } from "lucide-react"

export const dashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
    },
    {
      title: "History",
      href: "/history",
      icon: "History",
    },
    {
      title: "Languages",
      href: "/languages",
      icon: "Languages",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "Settings",
    },
  ],
}
