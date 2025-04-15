
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanBarcode, Plus, Trash } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StockCheckUIItem } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { products } from "@/utils/mockData";
import { toast } from "sonner";

interface StockCheckBarcodeModeProps {
  onSaveItem: (item: StockCheckUIItem) => void;
  scannedItems: StockCheckUIItem[];
  onRemoveItem: (id: string) => void;
}

export function StockCheckBarcodeMode({ onSaveItem, scannedItems, onRemoveItem }: StockCheckBarcodeModeProps) {
  const [barcode, setBarcode] = useState("");
  const [currentProduct, setCurrentProduct] = useState<StockCheckUIItem | null>(null);
  const [actualQuantity, setActualQuantity] = useState<number>(0);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcode) {
      toast.error("Vui lòng nhập mã vạch");
      return;
    }
    
    // Find product by barcode
    const foundProduct = products.find(p => p.barcode === barcode);
    
    if (!foundProduct) {
      toast.error("Không tìm thấy sản phẩm với mã vạch này");
      return;
    }
    
    // Create a StockCheckUIItem from the found product
    const stockCheckItem: StockCheckUIItem = {
      id: foundProduct.id,
      productId: foundProduct.id,
      productName: foundProduct.scientificName,
      name: foundProduct.scientificName,
      commonName: foundProduct.commonName,
      expectedQuantity: foundProduct.quantity,
      actualQuantity: foundProduct.quantity, // Default to expected
      difference: 0,
      isChecked: false,
      categoryId: foundProduct.categoryId,
      barcode: foundProduct.barcode
    };
    
    setCurrentProduct(stockCheckItem);
    setActualQuantity(stockCheckItem.expectedQuantity);
    setBarcode("");
  };
  
  const handleSaveScannedItem = () => {
    if (currentProduct) {
      const difference = actualQuantity - currentProduct.expectedQuantity;
      const updatedItem = {
        ...currentProduct,
        actualQuantity,
        difference,
        isChecked: true
      };
      
      onSaveItem(updatedItem);
      setCurrentProduct(null);
      setActualQuantity(0);
      toast.success("Đã thêm sản phẩm vào danh sách kiểm kê");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Nhập mã vạch..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="pl-10"
            />
            <ScanBarcode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <Button type="submit">Tìm</Button>
        </form>
        
        {currentProduct && (
          <Card className="mt-4">
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg">{currentProduct.name}</h3>
                {currentProduct.commonName && (
                  <p className="text-muted-foreground">{currentProduct.commonName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Số lượng hệ thống</Label>
                  <p className="font-medium">{currentProduct.expectedQuantity}</p>
                </div>
                <div>
                  <Label htmlFor="actualQuantity">Số lượng thực tế</Label>
                  <Input
                    id="actualQuantity"
                    type="number"
                    min="0"
                    value={actualQuantity}
                    onChange={(e) => setActualQuantity(parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveScannedItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Lưu sản phẩm
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Sản phẩm đã quét ({scannedItems.length})</h3>
        
        {scannedItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead className="w-[100px]">Hệ thống</TableHead>
                <TableHead className="w-[100px]">Thực tế</TableHead>
                <TableHead className="w-[100px]">Chênh lệch</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scannedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.expectedQuantity}</TableCell>
                  <TableCell>{item.actualQuantity}</TableCell>
                  <TableCell>{item.difference}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Chưa có sản phẩm nào được quét
          </p>
        )}
      </div>
    </div>
  );
}
