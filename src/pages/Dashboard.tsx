
import { Package, ClipboardCheck, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ActivityItem } from "@/components/ActivityItem";
import { products, stockChecks, activities } from "@/utils/mockData";

export default function Dashboard() {
  const totalProducts = products.length;
  const lastStockCheck = stockChecks[0];
  const recentActivities = activities.slice(0, 5); // Show last 5 activities
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
        <p className="text-muted-foreground">Tổng quan về cửa hàng của bạn</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Tổng sản phẩm"
          value={totalProducts}
          icon={<Package size={20} />}
          linkTo="/products"
        />
        
        <StatCard
          title="Lịch sử kiểm kê"
          value={stockChecks.length}
          icon={<ClipboardCheck size={20} />}
          description={`Lần kiểm kê cuối: ${lastStockCheck.date.toLocaleDateString('vi-VN')}`}
          linkTo="/stock-check/history"
        />
        
        <StatCard
          title="Hoạt động gần đây"
          value={activities.length}
          icon={<Activity size={20} />}
          description="Xem tất cả hoạt động"
          linkTo="/activities"
          className="border-l-4 border-primary"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Hoạt động gần đây</h2>
          <a href="/activities" className="text-sm text-primary hover:underline">
            Xem tất cả
          </a>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

