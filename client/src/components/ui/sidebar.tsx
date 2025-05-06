import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Calendar,
  BookOpen,
  Clock,
  CheckSquare,
  BarChart2,
  LogOut,
  Book,
  UsersRound,
  FileText,
  Clipboard,
  Brain,
  Sparkles,
} from "lucide-react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export function Sidebar({ className, items, ...props }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className="h-screen" {...props}>
      <nav className={cn("flex space-y-2 flex-col", className)}>
        {items.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                isActive &&
                  "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function SidebarContainer() {
  const { currentUser, userRole, logout } = useAuth();
  const studentItems: SidebarItem[] = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      path: "/student/dashboard",
    },
    {
      icon: <Calendar size={20} />,
      label: "Smart Planner",
      path: "/student/planner",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Notes & Flashcards",
      path: "/student/notes",
    },
    {
      icon: <Book size={20} />,
      label: "Book Marketplace",
      path: "/student/books",
    },
    { icon: <Clock size={20} />, label: "Focus Mode", path: "/student/focus" },
    {
      icon: <BarChart2 size={20} />,
      label: "Analytics",
      path: "/student/analytics",
    },
    {
      icon: <Sparkles size={20} />,
      label: "AI Summarizer",
      path: "/student/summarizer",
    },
  ];

  const teacherItems: SidebarItem[] = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      path: "/teacher/dashboard",
    },
    {
      icon: <UsersRound size={20} />,
      label: "Students",
      path: "/teacher/students",
    },
    {
      icon: <FileText size={20} />,
      label: "Assignments",
      path: "/teacher/assignments",
    },
    {
      icon: <Clipboard size={20} />,
      label: "Grading",
      path: "/teacher/grading",
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Analytics",
      path: "/teacher/analytics",
    },
  ];

  const sidebarItems = userRole === "teacher" ? teacherItems : studentItems;
  const itemsForSidebar = sidebarItems.map((item) => ({
    title: item.label,
    href: item.path,
    icon: item.icon,
  }));

  return (
    <>
      <Sidebar items={itemsForSidebar} className="w-64" />
      <button onClick={logout}>Logout</button> {/* Separate logout button */}
    </>
  );
}
