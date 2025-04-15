import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  ClipboardList,
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { StockCheckUIItem } from "@/lib/types";
import { StockCheckBarcodeMode } from "@/components/StockCheckBarcodeMode";
import { products } from "@/utils/mockData";
import { toast } from "sonner";
import { StockCheckScanDialog } from "@/components/StockCheckScanDialog";
import { StockCheckFilter } from "@/components/StockCheckFilter";
import { StockCheckList } from "@/components/StockCheckList";

type Mode = "manual" | "barcode";

// Mock data for categories - in a real app this would come from an API
const categories = [
  { id: "cat1", name: "Thuốc kháng sinh", description: "", productCount: 15 },
  { id: "cat2", name: "Vaccine", description: "", productCount: 8 },
  { id: "cat3", name: "Thực phẩm bổ sung", description: "", productCount: 12 },
];

// Check if current month has been checked already (mocked)
const currentMonthChecked = false;

export default function StockCheck() {
  const navigate = useNavigate();
  const [items, setItems] = useState<StockCheckUIItem[]>([]);
  const [notes, setNotes] = useState("");
  const [predefinedProducts, setPredefinedProducts] = useState<StockCheckUIItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<StockCheckUIItem[]>([]);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockCheckUIItem | null>(null);
  const [actualQuantity, setActualQuantity] = useState(0);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

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
    console.log("Saving session with items:", activeTab === "manual" ? filteredProducts : items);
    console.log("Notes:", notes);
    setShowSaveSuccess(true);
  };

  const handleReturnToCheck = () => {
    setShowSaveSuccess(false);
    // Keep all values but reset the success state
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

  if (currentMonthChecked) {
    return (
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
      </div>
    );
  }

  if (showSaveSuccess) {
    return (
      <div className="space-y-8">
        <div className="bg-muted p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium mb-2">
            Đã lưu thành công
          </h3>
          <Button 
            onClick={handleReturnToCheck}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kiểm kê lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kiểm kê kho</h1>
      </div>

      <Tabs 
        defaultValue="manual" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Kiểm kê thủ công</TabsTrigger>
          <TabsTrigger value="barcode">Quét mã vạch</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
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
                mode="list"
              />
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Không tìm thấy sản phẩm phù hợp với bộ lọc
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="barcode" className="space-y-4">
          <StockCheckBarcodeMode
            onSaveItem={handleAddItem}
            scannedItems={items}
            onRemoveItem={handleRemoveItem}
          />
        </TabsContent>
      </Tabs>

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
