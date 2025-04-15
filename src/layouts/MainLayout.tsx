
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <TooltipProvider>
      <div className="h-full min-h-screen w-full bg-app">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main
          className={`flex min-h-screen flex-col transition-all duration-300 ${
            isSidebarOpen ? "md:pl-64" : ""
          }`}
        >
          <div className="container mx-auto px-4 pb-20 pt-6">
            <Outlet />
          </div>
        </main>

        {isMobile && <BottomNav />}
      </div>
    </TooltipProvider>
  );
}
