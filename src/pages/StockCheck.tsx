
import { useState } from "react";
import { Barcode, Check, Save, Search } from "lucide-react";
import { products } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function StockCheck() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockItems, setStockItems] = useState(() => 
    products.map(product => ({
      id: product.id,
      name: product.scientificName,
      commonName: product.commonName,
      expectedQuantity: product.quantity,
      actualQuantity: product.quantity,
      difference: 0
    }))
  );
  const [notes, setNotes] = useState("");
  
  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.commonName && item.commonName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleQuantityChange = (id: string, value: number) => {
    setStockItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          actualQuantity: value,
          difference: value - item.expectedQuantity
        };
      }
      return item;
    }));
  };
  
  const handleSaveSession = () => {
    // In a real app, this would save the stock check session to the database
    console.log({
      date: new Date(),
      items: stockItems,
      notes
    });
    
    toast.success("Phiên kiểm kê đã được lưu thành công!");
  };
  
  const handleBarcodeScanner = () => {
    // In a real app, this would trigger the barcode scanner
    toast("Chức năng quét mã vạch đang được phát triển", {
      description: "Tính năng này sẽ có trong phiên bản tiếp theo."
    });
  };
  
  const getDifferenceClass = (difference: number) => {
    if (difference > 0) return "text-secondary";
    if (difference < 0) return "text-destructive";
    return "text-muted-foreground";
  };
  
  const totalItemCount = stockItems.length;
  const checkedItemsCount = stockItems.filter(item => item.actualQuantity !== item.expectedQuantity).length;
  const hasDifferences = stockItems.some(item => item.difference !== 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kiểm kê kho</h1>
        <p className="text-muted-foreground">Kiểm tra và cập nhật số lượng thực tế của sản phẩm</p>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
        <div>
          <p className="text-sm text-muted-foreground">Tổng sản phẩm: {totalItemCount}</p>
          <p className="text-sm text-muted-foreground">Đã kiểm tra: {checkedItemsCount}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBarcodeScanner}>
            <Barcode className="mr-2 h-4 w-4" />
            Quét mã vạch
          </Button>
          <Button onClick={handleSaveSession}>
            <Save className="mr-2 h-4 w-4" />
            Lưu phiên
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm sản phẩm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Ghi chú phiên kiểm kê</h2>
        <Textarea 
          placeholder="Nhập ghi chú cho phiên kiểm kê này..." 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Không tìm thấy sản phẩm nào
          </p>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  {item.name}
                </CardTitle>
                {item.commonName && (
                  <p className="text-sm text-muted-foreground">{item.commonName}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Số lượng hệ thống</p>
                    <p className="text-lg font-medium">{item.expectedQuantity}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Số lượng thực tế</p>
                    <Input
                      type="number"
                      value={item.actualQuantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      min={0}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Chênh lệch</p>
                    <p className={`text-lg font-medium ${getDifferenceClass(item.difference)}`}>
                      {item.difference > 0 ? "+" : ""}{item.difference}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-end">
                  {item.difference !== 0 ? (
                    <p className={`text-sm ${getDifferenceClass(item.difference)}`}>
                      {item.difference > 0 
                        ? "Số lượng thực tế nhiều hơn hệ thống" 
                        : "Số lượng thực tế ít hơn hệ thống"}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Đã khớp
                    </p>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSession} disabled={!hasDifferences}>
          <Save className="mr-2 h-4 w-4" />
          Lưu phiên kiểm kê
        </Button>
      </div>
    </div>
  );
}
