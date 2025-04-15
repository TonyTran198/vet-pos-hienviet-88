
import { useState } from "react";
import { Barcode, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/utils/mockData";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StockCheckUIItem } from "@/lib/types";

interface StockCheckBarcodeModeProps {
  onSaveSession: () => void;
}

export function StockCheckBarcodeMode({ onSaveSession }: StockCheckBarcodeModeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBarcode, setCurrentBarcode] = useState("");
  const [scannedQuantity, setScannedQuantity] = useState<number>(0);
  const [scannedItems, setScannedItems] = useState<StockCheckUIItem[]>([]);
  const [currentProduct, setCurrentProduct] = useState<StockCheckUIItem | null>(null);

  const handleBarcodeSubmit = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    
    if (!product) {
      toast.error("Không tìm thấy sản phẩm", {
        description: "Mã vạch không tồn tại trong hệ thống"
      });
      return;
    }

    const stockItem: StockCheckUIItem = {
      id: product.id,
      name: product.scientificName,
      commonName: product.commonName,
      expectedQuantity: product.quantity,
      actualQuantity: 0,
      difference: -product.quantity,
      isChecked: false,
      categoryId: product.categoryId,
      barcode: product.barcode
    };

    setCurrentProduct(stockItem);
    setCurrentBarcode("");
    setIsDialogOpen(true);
  };

  const handleSaveScannedItem = () => {
    if (!currentProduct) return;

    const updatedItem = {
      ...currentProduct,
      actualQuantity: scannedQuantity,
      difference: scannedQuantity - currentProduct.expectedQuantity,
      isChecked: true
    };

    setScannedItems(prev => {
      const exists = prev.find(item => item.id === updatedItem.id);
      if (exists) {
        return prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        );
      }
      return [...prev, updatedItem];
    });

    setIsDialogOpen(false);
    setScannedQuantity(0);
    setCurrentProduct(null);
    
    toast.success("Đã lưu số lượng sản phẩm", {
      description: `${updatedItem.name} đã được cập nhật.`
    });
  };

  const handleSimulateScan = () => {
    // In a real app, this would be connected to a barcode scanner
    toast("Chức năng quét mã vạch đang được phát triển", {
      description: "Hiện tại bạn có thể nhập mã vạch thủ công để test."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Nhập mã vạch..."
            value={currentBarcode}
            onChange={(e) => setCurrentBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentBarcode) {
                handleBarcodeSubmit(currentBarcode);
              }
            }}
          />
        </div>
        <Button variant="outline" onClick={handleSimulateScan}>
          <Barcode className="h-4 w-4" />
        </Button>
      </div>

      {scannedItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Sản phẩm đã quét ({scannedItems.length})</h3>
            <Button onClick={onSaveSession}>
              <Save className="mr-2 h-4 w-4" />
              Lưu phiên kiểm kê
            </Button>
          </div>

          <div className="space-y-3">
            {scannedItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      {item.commonName && (
                        <p className="text-sm text-muted-foreground">{item.commonName}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Đã kiểm kê
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Số lượng hệ thống</p>
                      <p className="font-medium">{item.expectedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Số lượng thực tế</p>
                      <p className="font-medium">{item.actualQuantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chênh lệch</p>
                      <p className={`font-medium ${
                        item.difference > 0 ? "text-green-600" : 
                        item.difference < 0 ? "text-red-600" : 
                        "text-muted-foreground"
                      }`}>
                        {item.difference > 0 ? "+" : ""}{item.difference}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập số lượng thực tế</DialogTitle>
          </DialogHeader>
          
          {currentProduct && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium">{currentProduct.name}</h3>
                {currentProduct.commonName && (
                  <p className="text-sm text-muted-foreground">{currentProduct.commonName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Số lượng hệ thống</p>
                  <p className="text-lg font-medium">{currentProduct.expectedQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số lượng thực tế</p>
                  <Input
                    type="number"
                    value={scannedQuantity || ''}
                    onChange={(e) => setScannedQuantity(parseInt(e.target.value) || 0)}
                    min={0}
                    className="mt-1"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveScannedItem}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
