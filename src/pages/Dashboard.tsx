
import { Package, ClipboardCheck, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ProductItem } from "@/components/ProductItem";
import { products, stockChecks } from "@/utils/mockData";

export default function Dashboard() {
  const totalProducts = products.length;
  const lastStockCheck = stockChecks[0];
  const recentProducts = products.slice(0, 3); // Get 3 most recent products
  
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
          value={recentProducts.length}
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
          {lastStockCheck && (
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClipboardCheck size={16} />
                <span>Kiểm kê kho</span>
                <span>•</span>
                <time>{lastStockCheck.date.toLocaleDateString('vi-VN')}</time>
              </div>
              <p className="mt-1 text-sm">Đã kiểm tra {lastStockCheck.products.length} sản phẩm</p>
            </div>
          )}
          
          {recentProducts.map((product) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              showAddedDate={true} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
