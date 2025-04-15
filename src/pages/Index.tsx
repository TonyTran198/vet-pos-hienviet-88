
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  );
};

export default Index;
