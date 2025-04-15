
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { products, categories } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Find the product based on the ID from URL params
  const product = products.find((p) => p.id === productId);
  
  // Find the category of the product
  const category = product ? categories.find((c) => c.id === product.categoryId) : null;
  
  // Check if product exists
  useEffect(() => {
    if (!product) {
      toast.error("Không tìm thấy sản phẩm");
      navigate("/products");
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleEdit = () => {
    navigate(`/products/edit/${productId}`);
  };
  
  const handleDelete = () => {
    // In a real app, this would delete the product from the database
    toast.success("Đã xóa sản phẩm thành công");
    navigate("/products");
  };
  
  // Format date for better display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {/* Product name and status */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold">{product.scientificName}</h2>
              {product.commonName && (
                <p className="text-muted-foreground">{product.commonName}</p>
              )}
            </div>
            <Badge variant={product.status === "active" ? "default" : "destructive"}>
              {product.status === "active" ? "Còn bán" : "Ngừng bán"}
            </Badge>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mb-6">
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit size={16} />
              Sửa
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
              Xóa
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          {/* Product details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mã vạch</p>
                <p className="font-medium">{product.barcode || "Chưa có"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                <p className="font-medium">{product.sku || "Chưa có"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Danh mục</p>
                <p className="font-medium">{category?.name || "Chưa phân loại"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đơn vị tính</p>
                <p className="font-medium">{product.unit || "Chưa có"}</p>
              </div>
              
              {product.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số lượng tồn kho</p>
                <p className={`font-bold ${product.quantity <= 10 ? "text-destructive" : ""}`}>
                  {product.quantity}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Giá nhập</p>
                <p className="font-medium">{product.costPrice.toLocaleString("vi-VN")}đ</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Giá bán</p>
                <p className="font-bold text-primary text-lg">{product.sellingPrice.toLocaleString("vi-VN")}đ</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p className="font-medium">{formatDate(product.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p className="font-medium">{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Description, Uses, Ingredients */}
          <div className="space-y-4">
            {product.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                <p className="mt-1">{product.description}</p>
              </div>
            )}
            
            {product.uses && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Công dụng</p>
                <p className="mt-1">{product.uses}</p>
              </div>
            )}
            
            {product.ingredients && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thành phần</p>
                <p className="mt-1">{product.ingredients}</p>
              </div>
            )}
            
            {product.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
                <p className="mt-1">{product.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{product.scientificName}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
