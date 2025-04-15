
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ClipboardCheck,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: Package, label: "Danh sách sản phẩm", path: "/products" },
    { icon: FolderTree, label: "Danh mục sản phẩm", path: "/categories" },
    { icon: ClipboardCheck, label: "Kiểm kê", path: "/stock-check" },
    { icon: BarChart2, label: "Báo cáo", path: "/reports" },
    { icon: Settings, label: "Cài đặt", path: "/settings" },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white shadow-lg transition-all duration-300",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <h2 className={cn("text-xl font-bold text-primary", !isOpen && "hidden")}>
            VET-POS
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className={cn("absolute -right-10 top-3 bg-white", !isOpen && "-right-12")}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>
        <Separator />
        <div className={cn("flex flex-col gap-1 p-2", !isOpen && "hidden")}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                location.pathname === item.path && "bg-primary/10 text-primary"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
