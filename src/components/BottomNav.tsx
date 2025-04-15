
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardCheck, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: ClipboardCheck, label: "Kiểm kê", path: "/stock-check" },
    { icon: Package, label: "Sản phẩm", path: "/products" },
    { icon: BarChart2, label: "Báo cáo", path: "/reports" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background shadow-lg">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center"
          >
            <div
              className={cn(
                "flex h-10 w-10 flex-col items-center justify-center rounded-full transition-colors",
                location.pathname === item.path ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <item.icon size={20} />
            </div>
            <span className="text-xs font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
