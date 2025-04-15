import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ScanBarcode, 
  ListChecks, 
  Save, 
  ClipboardList,
  AlertCircle 
} from "lucide-react";
import { StockCheckUIItem } from "@/lib/types";
import { StockCheckBarcodeMode } from "@/components/StockCheckBarcodeMode";
import { products } from "@/utils/mockData";
import { toast } from "sonner";
import { StockCheckScanDialog } from "@/components/StockCheckScanDialog";
import { StockCheckFilter } from "@/components/StockCheckFilter";
import { StockCheckList } from "@/components/StockCheckList";

type Mode = "list" | "barcode";

// Mock data for categories - in a real app this would come from an API
const categories = [
  { id: "cat1", name: "Thuốc kháng sinh", description: "", productCount: 15 },
  { id: "cat2", name: "Vaccine", description: "", productCount: 8 },
  { id: "cat3", name: "Thực phẩm bổ sung", description: "", productCount: 12 },
];

// Check if current month has been checked already (mocked)
const currentMonthChecked = false; // This would be from an API in a real app

export default function StockCheck() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("list");
  const [items, setItems] = useState<StockCheckUIItem[]>([]);
  const [notes, setNotes] = useState("");
  const [predefinedProducts, setPredefinedProducts] = useState<StockCheckUIItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<StockCheckUIItem[]>([]);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockCheckUIItem | null>(null);
  const [actualQuantity, setActualQuantity] = useState(0);

  useEffect(() => {
    // Load products and sort alphabetically (A-Z)
    const productsToCount = products
      .map(product => ({
        id: product.id,
        productId: product.id,
        productName: product.scientificName,
        name: product.scientificName,
        commonName: product.commonName || "",
        expectedQuantity: product.quantity,
        actualQuantity: 0,
        difference: -product.quantity,
        isChecked: false,
        categoryId: product.categoryId,
        barcode: product.barcode
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setPredefinedProducts(productsToCount);
    setFilteredProducts(productsToCount);
  }, []);

  const handleAddItem = (item: StockCheckUIItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = item;
        return newItems;
      } else {
        return [...prevItems, item];
      }
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSaveSession = () => {
    console.log("Saving session with items:", items);
    console.log("Notes:", notes);
    toast.success("Đã hoàn thành kiểm kê tháng này");
    setItems([]);
    setNotes("");
  };

  const handleUpdateQuantity = (id: string, actualQuantity: number) => {
    setPredefinedProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          const difference = actualQuantity - product.expectedQuantity;
          return {
            ...product,
            actualQuantity,
            difference,
            isChecked: true
          };
        }
        return product;
      })
    );
    
    // Also update filtered products
    setFilteredProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          const difference = actualQuantity - product.expectedQuantity;
          return {
            ...product,
            actualQuantity,
            difference,
            isChecked: true
          };
        }
        return product;
      })
    );
  };

  const handleAddPredefinedToSession = () => {
    const checkedItems = filteredProducts.filter(item => item.isChecked);
    if (checkedItems.length === 0) {
      toast.error("Vui lòng nhập số lượng thực tế cho ít nhất một sản phẩm");
      return;
    }
    
    setItems(checkedItems);
    toast.success(`Đã thêm ${checkedItems.length} sản phẩm vào phiên kiểm kê`);
  };

  const handleFilterChange = (filters: { category: string; keyword: string; status: string }) => {
    const filtered = predefinedProducts.filter(product => {
      // Category filter
      const matchesCategory = filters.category === "all" || product.categoryId === filters.category;
      
      // Keyword filter (search by name or barcode)
      const matchesKeyword = 
        !filters.keyword ||
        product.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        (product.barcode && product.barcode.includes(filters.keyword));
      
      // Status filter
      const matchesStatus = 
        filters.status === "all" ||
        (filters.status === "checked" && product.isChecked) ||
        (filters.status === "unchecked" && !product.isChecked);
      
      return matchesCategory && matchesKeyword && matchesStatus;
    });
    
    setFilteredProducts(filtered);
  };
  
  const handleBarcodeClick = (product: StockCheckUIItem) => {
    setSelectedProduct(product);
    setActualQuantity(product.actualQuantity || 0);
    setScanDialogOpen(true);
  };
  
  const handleSaveScannedProduct = () => {
    if (selectedProduct) {
      handleUpdateQuantity(selectedProduct.id, actualQuantity);
      setScanDialogOpen(false);
      toast.success(`Đã cập nhật số lượng cho ${selectedProduct.name}`);
    }
  };
  
  const handleReqeustRecheck = () => {
    // In a real app, this would make an API call
    toast.success("Đã gửi yêu cầu kiểm kê lại tháng này");
    // After approval, we could set currentMonthChecked to false
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kiểm kê kho</h1>
        {!currentMonthChecked && (
          <div className="space-x-2">
            <Button
              variant={mode === "list" ? "default" : "outline"}
              onClick={() => setMode("list")}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              Danh sách có sẵn
            </Button>
            <Button
              variant={mode === "barcode" ? "default" : "outline"}
              onClick={() => setMode("barcode")}
            >
              <ScanBarcode className="mr-2 h-4 w-4" />
              Quét mã vạch
            </Button>
          </div>
        )}
      </div>

      {!currentMonthChecked ? (
        <>
          {mode === "barcode" && (
            <StockCheckBarcodeMode
              onSaveItem={handleAddItem}
              scannedItems={items}
              onRemoveItem={handleRemoveItem}
            />
          )}

          {mode === "list" && (
            <div className="space-y-4">
              <StockCheckFilter 
                categories={categories} 
                onFilterChange={handleFilterChange} 
              />
              
              {filteredProducts.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Danh sách sản phẩm cần kiểm kê ({filteredProducts.length})
                  </h3>
                  
                  <StockCheckList 
                    products={filteredProducts}
                    onUpdateQuantity={handleUpdateQuantity}
                    onBarcodeClick={handleBarcodeClick}
                    mode={mode}
                  />
                  
                  <Button onClick={handleAddPredefinedToSession} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Thêm vào phiên kiểm kê
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc
                </p>
              )}
            </div>
          )}

          <Card>
            <CardContent className="space-y-2 pt-4">
              <Label htmlFor="notes">Ghi chú</Label>
              <Input
                id="notes"
                placeholder="Nhập ghi chú về phiên kiểm kê này..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/stock-check/history")}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Lịch sử kiểm kê
            </Button>
            <Button onClick={handleSaveSession}>
              <Save className="mr-2 h-4 w-4" />
              Lưu phiên kiểm kê
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div className="bg-muted p-6 rounded-lg text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">
              Đã hoàn thành kiểm kê tháng này
            </h3>
            <p className="text-muted-foreground mb-6">
              Bạn đã hoàn thành kiểm kê cho tháng này. Bạn có thể xem lịch sử kiểm kê hoặc yêu cầu kiểm kê lại.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleReqeustRecheck}>
                Yêu cầu kiểm kê lại
              </Button>
              <Button onClick={() => navigate("/stock-check/history")}>
                Xem lịch sử kiểm kê
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/stock-check/history")}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Lịch sử kiểm kê
            </Button>
          </div>
        </div>
      )}
      
      <StockCheckScanDialog 
        isOpen={scanDialogOpen}
        onClose={() => setScanDialogOpen(false)}
        product={selectedProduct}
        actualQuantity={actualQuantity}
        onQuantityChange={setActualQuantity}
        onSave={handleSaveScannedProduct}
      />
    </div>
  );
}
