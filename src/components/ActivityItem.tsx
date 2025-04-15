
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Activity } from "@/lib/types";
import { ClipboardCheck, Plus, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

const activityIcons = {
  stock_check: ClipboardCheck,
  product_add: Plus,
  low_stock: AlertTriangle,
};

const getRelativeDate = (date: Date) => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
  if (isToday) return 'Hôm nay';
  if (isYesterday) return 'Hôm qua';
  return format(date, 'dd/MM/yyyy', { locale: vi });
};

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.type];
  const content = (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <div className="mt-1">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{activity.title}</h3>
          {activity.description && (
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {getRelativeDate(activity.timestamp)}, {format(activity.timestamp, 'HH:mm')}
          </p>
        </div>
      </div>
    </Card>
  );

  if (activity.link) {
    return <Link to={activity.link}>{content}</Link>;
  }

  return content;
}

