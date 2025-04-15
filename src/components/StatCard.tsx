
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  linkTo?: string;
  linkText?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  linkTo,
  linkText = "Xem chi tiết",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
      {linkTo && (
        <CardFooter className="flex justify-end p-2">
          <Button asChild variant="link" size="sm">
            <Link to={linkTo} className="flex items-center gap-1">
              {linkText}
              <ChevronRight size={16} />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
