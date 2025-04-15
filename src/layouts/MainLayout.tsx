
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <TooltipProvider>
      <div className="h-full min-h-screen w-full bg-app">
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

