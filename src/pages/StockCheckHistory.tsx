
import { useState } from "react";
import { stockChecks } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

export default function StockCheckHistory() {
  const navigate = useNavigate();
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm");
  };
  
  const toggleExpand = (id: string) => {
    if (expandedCheckId === id) {
      setExpandedCheckId(null);
    } else {
      setExpandedCheckId(id);
    }
  };
  
  // Get available years from stock checks
  const years = [...new Set(stockChecks.map(check => 
    new Date(check.date).getFullYear()
  ))].sort((a, b) => b - a);
  
  // Get available months (display as names)
  const months = [
    { value: "0", label: "Tháng 1" },
    { value: "1", label: "Tháng 2" },
    { value: "2", label: "Tháng 3" },
    { value: "3", label: "Tháng 4" },
    { value: "4", label: "Tháng 5" },
    { value: "5", label: "Tháng 6" },
    { value: "6", label: "Tháng 7" },
    { value: "7", label: "Tháng 8" },
    { value: "8", label: "Tháng 9" },
    { value: "9", label: "Tháng 10" },
    { value: "10", label: "Tháng 11" },
    { value: "11", label: "Tháng 12" },
  ];
  
  // Filter checks based on all criteria
  const filteredChecks = stockChecks
    .filter(check => {
      const checkDate = new Date(check.date);
      const checkYear = checkDate.getFullYear().toString();
      const checkMonth = checkDate.getMonth().toString();
      
      const matchesYear = yearFilter === "all" || checkYear === yearFilter;
      const matchesMonth = monthFilter === "all" || checkMonth === monthFilter;
      
      const matchesSearch = 
        searchQuery === "" || 
        check.products.some(product => 
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        check.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(check.date).includes(searchQuery);
      
      return matchesYear && matchesMonth && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleExportData = (checkId: string) => {
    // In a real app, this would export the stock check data
    toast.success("Xuất dữ liệu thành công", {
      description: "Dữ liệu kiểm kê đã được tải xuống."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/stock-check")}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Lịch sử kiểm kê</h1>
          <p className="text-muted-foreground">Xem các phiên kiểm kê trước đây</p>
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <div className="flex items-center mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <h3 className="font-medium">Lọc theo thời gian</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Năm</p>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả các năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các năm</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tháng</p>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả các tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các tháng</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tìm kiếm</p>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phiên kiểm kê..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredChecks.length > 0 ? (
          filteredChecks.map((check) => (
            <Card key={check.id} className="overflow-hidden">
              <CardHeader
                className="flex cursor-pointer flex-row items-center justify-between p-4"
                onClick={() => toggleExpand(check.id)}
              >
                <div>
                  <CardTitle className="text-base font-medium">
                    Kiểm kê ngày {formatDate(check.date)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {check.products.length} sản phẩm
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {check.products.some((p) => p.difference !== 0) ? (
                    <Badge variant="outline" className="text-warning">
                      Có chênh lệch
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-secondary">
                      Khớp hoàn toàn
                    </Badge>
                  )}
                  {expandedCheckId === check.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </CardHeader>
              
              {expandedCheckId === check.id && (
                <CardContent className="px-4 pb-4">
                  <Separator className="mb-4" />
                  
                  <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm" onClick={() => handleExportData(check.id)}>
                      <Download className="h-3 w-3 mr-1" />
                      Xuất dữ liệu
                    </Button>
                  </div>
                  
                  {check.notes && (
                    <div className="mb-4 rounded-md bg-muted p-3">
                      <p className="text-sm font-medium">Ghi chú:</p>
                      <p className="text-sm">{check.notes}</p>
                    </div>
                  )}
                  
                  <p className="mb-2 text-sm font-medium">Danh sách sản phẩm kiểm kê:</p>
                  
                  <div className="space-y-3">
                    {check.products.map((product) => (
                      <div
                        key={product.productId}
                        className={`rounded-md border p-3 ${
                          product.difference !== 0 ? "border-orange-200 bg-orange-50" : ""
                        }`}
                      >
                        <p className="font-medium">{product.productName}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Hệ thống</p>
                            <p>{product.expectedQuantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Thực tế</p>
                            <p>{product.actualQuantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Chênh lệch</p>
                            <p
                              className={
                                product.difference > 0
                                  ? "text-secondary"
                                  : product.difference < 0
                                  ? "text-destructive"
                                  : ""
                              }
                            >
                              {product.difference > 0 ? "+" : ""}
                              {product.difference}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Không tìm thấy phiên kiểm kê nào
          </p>
        )}
      </div>
    </div>
  );
}
