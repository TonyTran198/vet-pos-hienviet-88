
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ScanBarcode, 
  ListChecks, 
  Save, 
  Trash, 
  ClipboardList, 
  ArrowLeft 
} from "lucide-react";
import { StockCheckUIItem } from "@/lib/types";
import { StockCheckBarcodeMode } from "@/components/StockCheckBarcodeMode";
import { products } from "@/utils/mockData";
import { toast } from "sonner";

type Mode = "list" | "barcode";

export default function StockCheck() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("list");
  const [items, setItems] = useState<StockCheckUIItem[]>([]);
  const [notes, setNotes] = useState("");
  const [predefinedProducts, setPredefinedProducts] = useState<StockCheckUIItem[]>([]);

  // Load pre-defined products when component mounts
  useEffect(() => {
    // In a real app, this would come from an API call for the current month's inventory
    const productsToCount = products
      .map(product => ({
        id: product.id,
        productId: product.id,
        productName: product.scientificName,
        name: product.scientificName,
        commonName: product.commonName || "",
        expectedQuantity: product.quantity,
        actualQuantity: 0, // Start with 0, user will input counted quantity
        difference: -product.quantity, // Initially the difference is negative (shortage)
        isChecked: false,
        categoryId: product.categoryId,
        barcode: product.barcode
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    setPredefinedProducts(productsToCount);
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
    toast.success("Phiên kiểm kê đã được lưu thành công");
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
  };

  const handleAddPredefinedToSession = () => {
    // Only add items that have been checked (actualQuantity was entered)
    const checkedItems = predefinedProducts.filter(item => item.isChecked);
    setItems(checkedItems);
    toast.success(`Đã thêm ${checkedItems.length} sản phẩm vào phiên kiểm kê`);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Kiểm kê kho</h1>
        </div>
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
      </div>

      {mode === "barcode" && (
        <StockCheckBarcodeMode
          onSaveItem={handleAddItem}
          scannedItems={items}
          onRemoveItem={handleRemoveItem}
          onSaveSession={handleSaveSession}
        />
      )}

      {mode === "list" && (
        <div className="space-y-4">
          {predefinedProducts.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Danh sách sản phẩm cần kiểm kê ({predefinedProducts.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead className="w-[100px]">Hệ thống</TableHead>
                    <TableHead className="w-[120px]">Thực tế</TableHead>
                    <TableHead className="w-[100px]">Chênh lệch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predefinedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.name}
                        {product.commonName && (
                          <div className="text-xs text-muted-foreground">{product.commonName}</div>
                        )}
                      </TableCell>
                      <TableCell>{product.expectedQuantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={product.actualQuantity || ""}
                          onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className={product.difference < 0 ? "text-red-500" : 
                                          product.difference > 0 ? "text-green-500" : ""}>
                        {product.isChecked ? product.difference : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button onClick={handleAddPredefinedToSession} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Thêm vào phiên kiểm kê
              </Button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Đang tải danh sách sản phẩm...
            </p>
          )}
          
          <div>
            <h3 className="text-lg font-medium mb-2">
              Danh sách sản phẩm kiểm kê ({items.length})
            </h3>
            {items.length > 0 ? (
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
                  {items.map((item) => (
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
                          onClick={() => handleRemoveItem(item.id)}
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
                Chưa có sản phẩm nào được thêm vào danh sách kiểm kê
              </p>
            )}
          </div>

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
        </div>
      )}
    </div>
  );
}
