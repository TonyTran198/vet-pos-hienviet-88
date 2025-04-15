
import { getLowStockProducts } from "@/utils/mockData";
import { ProductItem } from "@/components/ProductItem";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LowStockList() {
  const navigate = useNavigate();
  const lowStockProducts = getLowStockProducts(10);
  
  const handleExport = () => {
    // In a real app, this would export the list to Excel or PDF
    toast.success("Báo cáo đã được tải xuống", {
      description: "Danh sách sản phẩm sắp hết hàng.xlsx",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm sắp hết hàng</h1>
          <p className="text-muted-foreground">
            Danh sách sản phẩm cần nhập thêm (số lượng &lt; 10)
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>
      
      <div className="space-y-3">
        {lowStockProducts.length > 0 ? (
          lowStockProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Không có sản phẩm nào sắp hết hàng
          </p>
        )}
      </div>
    </div>
  );
}
