
import { Package, History, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ActivityItem } from "@/components/ActivityItem";
import { products, stockChecks, activities } from "@/utils/mockData";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const totalProducts = products.length;
  const lastStockCheck = stockChecks[0];
  const recentActivities = activities.slice(0, 5); // Show last 5 activities
  const lowStockCount = products.filter(p => p.quantity <= 10).length;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bảng Điều Khiển</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Tổng Sản Phẩm"
          value={totalProducts}
          icon={<Package className="h-5 w-5" />}
          linkTo="/products"
        />
        
        <StatCard
          title="Lịch Sử Kiểm Kê"
          value={stockChecks.length}
          icon={<History className="h-5 w-5" />}
          linkTo="/stock-check/history"
        />
      </div>

      {lowStockCount > 0 && (
        <Link to="/low-stock">
          <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="font-medium">{lowStockCount} sản phẩm sắp hết hàng</span>
              </div>
              <span className="text-muted-foreground text-sm">Cần được xử lý</span>
            </div>
          </div>
        </Link>
      )}
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Hoạt Động Gần Đây</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
