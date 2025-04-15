
import { Package, ClipboardCheck, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ProductItem } from "@/components/ProductItem";
import { products, stockChecks, getLowStockProducts } from "@/utils/mockData";

export default function Dashboard() {
  const lowStockProducts = getLowStockProducts(10);
  const totalProducts = products.length;
  const lastStockCheck = stockChecks[0];
  
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
          title="Sản phẩm sắp hết hàng"
          value={lowStockProducts.length}
          icon={<AlertTriangle size={20} />}
          description="Sản phẩm cần nhập thêm"
          linkTo="/low-stock"
          className="border-l-4 border-warning"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sản phẩm sắp hết hàng</h2>
          <a href="/low-stock" className="text-sm text-primary hover:underline">
            Xem tất cả
          </a>
        </div>
        
        {lowStockProducts.length > 0 ? (
          <div className="space-y-3">
            {lowStockProducts.slice(0, 3).map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Không có sản phẩm nào sắp hết hàng
          </p>
        )}
      </div>
    </div>
  );
}
