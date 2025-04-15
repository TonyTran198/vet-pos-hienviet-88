import { useState } from "react";
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
import { ScanBarcode, ListChecks, Save, Trash } from "lucide-react";
import { StockCheckUIItem } from "@/lib/types";
import { StockCheckBarcodeMode } from "@/components/StockCheckBarcodeMode";

type Mode = "list" | "barcode";

export default function StockCheck() {
  const [mode, setMode] = useState<Mode>("list");
  const [items, setItems] = useState<StockCheckUIItem[]>([]);
  const [notes, setNotes] = useState("");

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
    // TODO: Save the stock check session to the database
    console.log("Saving session with items:", items);
    console.log("Notes:", notes);
    // Clear the items and notes after saving
    setItems([]);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kiểm kê kho</h1>
        <div className="space-x-2">
          <Button
            variant={mode === "list" ? "default" : "outline"}
            onClick={() => setMode("list")}
          >
            <ListChecks className="mr-2 h-4 w-4" />
            Chế độ danh sách
          </Button>
          <Button
            variant={mode === "barcode" ? "default" : "outline"}
            onClick={() => setMode("barcode")}
          >
            <ScanBarcode className="mr-2 h-4 w-4" />
            Chế độ quét mã vạch
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
          {/* Stock Check List Mode UI */}
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
                      <TableCell>{item.difference}</TableCell>
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
            <CardContent className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Input
                id="notes"
                placeholder="Nhập ghi chú về phiên kiểm kê này..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
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
