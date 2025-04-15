
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanBarcode, Trash } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StockCheckUIItem } from "@/lib/types";
import { products } from "@/utils/mockData";
import { toast } from "sonner";
import { StockCheckScanDialog } from "./StockCheckScanDialog";
import { BarcodeScanner } from "./BarcodeScanner";

interface StockCheckBarcodeModeProps {
  onSaveItem: (item: StockCheckUIItem) => void;
  scannedItems: StockCheckUIItem[];
  onRemoveItem: (id: string) => void;
}

export function StockCheckBarcodeMode({ 
  onSaveItem, 
  scannedItems, 
  onRemoveItem 
}: StockCheckBarcodeModeProps) {
  const [barcode, setBarcode] = useState("");
  const [currentProduct, setCurrentProduct] = useState<StockCheckUIItem | null>(null);
  const [actualQuantity, setActualQuantity] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSearch = (searchBarcode: string) => {
    if (!searchBarcode) {
      toast.error("Vui lòng nhập mã vạch");
      return;
    }
    
    const foundProduct = products.find(p => p.barcode === searchBarcode);
    
    if (!foundProduct) {
      toast.error("Không tìm thấy sản phẩm với mã vạch này");
      return;
    }
    
    const stockCheckItem: StockCheckUIItem = {
      id: foundProduct.id,
      productId: foundProduct.id,
      productName: foundProduct.scientificName,
      name: foundProduct.scientificName,
      commonName: foundProduct.commonName,
      expectedQuantity: foundProduct.quantity,
      actualQuantity: foundProduct.quantity,
      difference: 0,
      isChecked: false,
      categoryId: foundProduct.categoryId,
      barcode: foundProduct.barcode
    };
    
    setCurrentProduct(stockCheckItem);
    setActualQuantity(stockCheckItem.expectedQuantity);
    setBarcode("");
    setIsDialogOpen(true);
  };
  
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(barcode);
  };
  
  const handleScanComplete = (scannedBarcode: string) => {
    handleSearch(scannedBarcode);
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
      setIsDialogOpen(false);
      toast.success("Đã thêm sản phẩm vào danh sách kiểm kê");
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Nhập mã vạch..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="pl-10"
          />
          <ScanBarcode 
            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer" 
            onClick={() => setIsScannerOpen(true)}
          />
        </div>
        <Button type="submit">Tìm</Button>
      </form>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanComplete}
      />

      <StockCheckScanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={currentProduct}
        actualQuantity={actualQuantity}
        onQuantityChange={setActualQuantity}
        onSave={handleSaveScannedItem}
      />
      
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
                  <TableCell className={item.difference < 0 ? "text-red-500" : 
                                     item.difference > 0 ? "text-green-500" : ""}>
                    {item.difference}
                  </TableCell>
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
