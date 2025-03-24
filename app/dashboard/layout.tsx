"use client"

import { useState } from "react";
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  Hotel,
  Menu,
  CreditCard,
  Send,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: PenTool,
  },
  // {
  //   title: "Schedule",
  //   href: "/dashboard/schedule/scheduled-posts",
  //   icon: Calendar,
  // },
  // {
  //   title: "Editor",
  //   href: "/dashboard/editor",
  //   icon: CreditCard,
  // },
  {
    title: "Connect",
    href: "/dashboard/social-connect",
    icon: Send,
  },
  {
    title: "Create Post",
    href: "/dashboard/post",
    icon: PlusCircle,
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden shadow-xl border-2 border-black bg-white fixed top-2 left-2 z-50 text-black hover:bg-purple-100">
                <Menu className="h-3 w-3 text-black" />
              </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-white text-black border-r">
          <nav className="flex flex-col gap-4 mt-8">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-100 text-black",
                  "transition-colors duration-200"
                )}
              >
                <item.icon className="h-5 w-5 text-black" />
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:flex bg-white fixed inset-y-0 z-50">
        <div className="w-64 border-r bg-white px-4 py-8 text-black">
          <div className="flex items-center gap-2 px-4 mb-8">
            <Hotel className="h-6 w-6 text-purple-700" />
            <span className="font-semibold text-lg">
              <Link href={"/"}>HotelSocial
              </Link>
            </span>
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-100 text-black",
                  "transition-colors duration-200"
                )}
              >
                <item.icon className="h-5 w-5 text-black" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {children}
        </div>
      </main>
    </div>

  );
}