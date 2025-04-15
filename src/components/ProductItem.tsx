
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductItemProps {
  product: Product;
  showActions?: boolean;
  canEditQuantity?: boolean;
  showAddedDate?: boolean;
}

export function ProductItem({ product, showActions = true, canEditQuantity = false, showAddedDate = false }: ProductItemProps) {
  const [quantity, setQuantity] = useState(product.quantity);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
      // In a real app, this would update the product quantity in the database
      toast.success(`Cập nhật số lượng thành công: ${product.scientificName}`);
    }
  };
  
  const isLowStock = quantity <= 10;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <h3 className="font-semibold">{product.scientificName}</h3>
            {product.commonName && (
              <p className="text-sm text-muted-foreground">{product.commonName}</p>
            )}
            <p className="mt-1 text-xs">
              <span className="text-muted-foreground">Mã vạch:</span> {product.barcode}
            </p>
            {showAddedDate && (
              <p className="mt-1 text-xs text-muted-foreground">
                Ngày thêm: {product.createdAt.toLocaleDateString('vi-VN')}
              </p>
            )}
            {product.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="col-span-12 flex items-center justify-between sm:col-span-6">
            <div className="space-y-1">
              <p className="font-bold text-primary">
                {product.sellingPrice.toLocaleString('vi-VN')}đ
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Số lượng:</span>
                {canEditQuantity ? (
                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-8 w-20"
                    min={0}
                  />
                ) : (
                  <span className={`font-medium ${isLowStock ? "text-destructive" : ""}`}>
                    {quantity}
                  </span>
                )}
                {isLowStock && !canEditQuantity && (
                  <Badge variant="destructive" className="text-xs">Sắp hết</Badge>
                )}
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/products/edit/${product.id}`}>
                    <Edit size={16} />
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="text-destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
