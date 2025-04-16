
import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isSidebarOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <TooltipProvider>
      <div className="h-full min-h-screen w-full bg-app">
        <div ref={menuRef}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center border-b bg-background px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">VET-POS</h1>
          </header>
        </div>

        <main
          className={`flex min-h-screen flex-col transition-all duration-300 ${
            isSidebarOpen ? "md:pl-64" : ""
          }`}
        >
          <div className="container mx-auto px-4 pb-20 pt-20">
            <Outlet />
          </div>
        </main>

        {isMobile && <BottomNav />}
      </div>
    </TooltipProvider>
  );
}
