import { useState, useEffect } from "react";
import { Barcode, Calendar, Check, ChevronDown, ChevronUp, Filter, Save, Search, LayoutList } from "lucide-react";
import { products, categories, stockChecks } from "@/utils/mockData";
import { StockCheck as StockCheckType, StockCheckItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { StockCheckBarcodeMode } from "@/components/StockCheckBarcodeMode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type CheckStatus = "all" | "pending" | "checked";
type CheckMode = "list" | "barcode";

export default function StockCheck() {
  const navigate = useNavigate();
  const [checkMode, setCheckMode] = useState<CheckMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("all");
  const [stockItems, setStockItems] = useState(() => 
    products.map(product => ({
      id: product.id,
      name: product.scientificName,
      commonName: product.commonName,
      expectedQuantity: product.quantity,
      actualQuantity: 0,
      difference: -product.quantity,
      isChecked: false,
      categoryId: product.categoryId,
      barcode: product.barcode
    }))
  );
  const [notes, setNotes] = useState("");
  const [currentMonthChecked, setCurrentMonthChecked] = useState(false);
  const [openCheckList, setOpenCheckList] = useState(true);
  const [openHistory, setOpenHistory] = useState(true);
  
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const hasCurrentMonthCheck = stockChecks.some(check => {
      const checkDate = new Date(check.date);
      return checkDate.getMonth() === currentMonth && checkDate.getFullYear() === currentYear;
    });
    
    setCurrentMonthChecked(hasCurrentMonthCheck);
  }, []);
  
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.commonName && item.commonName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.barcode.includes(searchQuery);
    
    const matchesCategory = 
      categoryFilter === "all" || item.categoryId === categoryFilter;
    
    const matchesStatus = 
      checkStatus === "all" || 
      (checkStatus === "checked" && item.isChecked) ||
      (checkStatus === "pending" && !item.isChecked);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleQuantityChange = (id: string, value: number) => {
    setStockItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          actualQuantity: value,
          difference: value - item.expectedQuantity,
          isChecked: true
        };
      }
      return item;
    }));
  };
  
  const handleSaveSession = () => {
    const now = new Date();
    const newStockCheck: StockCheckType = {
      id: `check${stockChecks.length + 1}`,
      date: now,
      products: stockItems
        .filter(item => item.isChecked)
        .map(item => ({
          productId: item.id,
          productName: item.name,
          expectedQuantity: item.expectedQuantity,
          actualQuantity: item.actualQuantity,
          difference: item.difference
        })),
      notes
    };
    
    console.log(newStockCheck);
    setCurrentMonthChecked(true);
    toast.success("Đã hoàn thành kiểm kê tháng này", {
      description: `Kiểm kê ${format(now, "dd/MM/yyyy")} đã được lưu thành công.`
    });
  };
  
  const handleRequestRecheck = () => {
    setCurrentMonthChecked(false);
    toast("Yêu cầu kiểm kê lại đã được chấp nhận", {
      description: "Vui lòng tiến hành kiểm kê lại."
    });
  };
  
  const handleBarcodeScanner = () => {
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
  const checkedItemsCount = stockItems.filter(item => item.isChecked).length;
  const hasDifferences = stockItems.some(item => item.difference !== 0 && item.isChecked);
  
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
          <Button 
            variant={checkMode === "list" ? "default" : "outline"}
            onClick={() => setCheckMode("list")}
          >
            <LayoutList className="mr-2 h-4 w-4" />
            Kiểm theo danh sách
          </Button>
          <Button 
            variant={checkMode === "barcode" ? "default" : "outline"}
            onClick={() => setCheckMode("barcode")}
          >
            <Barcode className="mr-2 h-4 w-4" />
            Quét mã vạch
          </Button>
          <Button onClick={() => navigate("/stock-check/history")}>
            <Calendar className="mr-2 h-4 w-4" />
            Lịch sử
          </Button>
        </div>
      </div>

      {!currentMonthChecked ? (
        <>
          {checkMode === "list" ? (
            <Collapsible open={openCheckList} onOpenChange={setOpenCheckList} className="border rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold">Danh sách kiểm kê</h2>
                  <Badge variant="outline" className="ml-2">
                    {checkedItemsCount}/{totalItemCount}
                  </Badge>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {openCheckList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <Separator />
                
                <div className="p-4">
                  <h2 className="mb-4 text-lg font-semibold">Ghi chú phiên kiểm kê</h2>
                  <Textarea 
                    placeholder="Nhập ghi chú cho phiên kiểm kê này..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="space-y-4 p-4">
                  {filteredItems.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Không tìm thấy sản phẩm nào
                    </p>
                  ) : (
                    filteredItems.map((item) => (
                      <Card key={item.id} className={item.isChecked ? "border-muted bg-muted/20" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-semibold">
                              {item.name}
                            </CardTitle>
                            {item.isChecked && (
                              <Badge variant="secondary" className="flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Đã kiểm kê
                              </Badge>
                            )}
                          </div>
                          {item.commonName && (
                            <p className="text-sm text-muted-foreground">{item.commonName}</p>
                          )}
                          <p className="text-xs text-muted-foreground">Barcode: {item.barcode}</p>
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
                                value={item.actualQuantity === 0 && !item.isChecked ? '' : item.actualQuantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                min={0}
                                className="mt-1"
                                placeholder="Nhập số lượng"
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
                            {item.isChecked ? (
                              item.difference !== 0 ? (
                                <p className={`text-sm ${getDifferenceClass(item.difference)}`}>
                                  {item.difference > 0 
                                    ? "Số lượng thực tế nhiều hơn hệ thống" 
                                    : "Số lượng thực tế ít hơn hệ thống"}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <Check className="mr-1 h-3 w-3" /> Đã khớp
                                </p>
                              )
                            ) : (
                              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                Chưa kiểm kê
                              </Badge>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
                
                <div className="flex justify-end p-4">
                  <Button onClick={handleSaveSession} disabled={checkedItemsCount === 0}>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu phiên kiểm kê
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <StockCheckBarcodeMode onSaveSession={handleSaveSession} />
          )}
        </>
      ) : (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center">
                <Check className="h-4 w-4 mr-2 text-secondary" />
                Kiểm kê tháng này đã hoàn thành
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Xem chi tiết trong lịch sử kiểm kê
              </p>
            </div>
            <Button variant="outline" onClick={handleRequestRecheck}>
              Yêu cầu kiểm kê lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
