
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { purchaseOrders, suppliers } from "@/utils/supplierMockData";
import { FilePlus, FileTextIcon, Search, Filter, Calendar, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

export default function PurchaseOrderList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(purchaseOrders);
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  
  // Apply filters
  useEffect(() => {
    let result = [...purchaseOrders];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.code.toLowerCase().includes(query) ||
        order.supplierName.toLowerCase().includes(query)
      );
    }
    
    // Apply supplier filter
    if (filterSupplier) {
      result = result.filter(order => order.supplierId === filterSupplier);
    }
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(order => order.status === filterStatus);
    }
    
    // Apply date filter
    if (filterDate) {
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }
    
    setFilteredOrders(result);
  }, [searchQuery, filterSupplier, filterStatus, filterDate]);
  
  const resetFilters = () => {
    setSearchQuery("");
    setFilterSupplier("");
    setFilterStatus("");
    setFilterDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn hàng nhập</h1>
        <Button asChild>
          <Link to="/purchase-orders/create">
            <FilePlus className="mr-2 h-4 w-4" />
            Tạo đơn hàng
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn, nhà cung cấp..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterSupplier} onValueChange={setFilterSupplier}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nhà cung cấp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả nhà cung cấp</SelectItem>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.businessName || supplier.ownerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="final">Hoàn thành</SelectItem>
              <SelectItem value="canceled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {filterDate ? format(filterDate, 'dd/MM/yyyy') : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarPicker
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
                locale={vi}
              />
              {filterDate && (
                <div className="p-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setFilterDate(undefined)}>
                    Xóa lựa chọn
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          {(filterSupplier || filterStatus || filterDate) && (
            <Button variant="ghost" onClick={resetFilters} className="gap-2">
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>
      
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link key={order.id} to={`/purchase-orders/${order.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-4">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{order.code}</h3>
                        {order.status === 'draft' ? (
                          <Badge variant="outline">Nháp</Badge>
                        ) : order.status === 'final' ? (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Hoàn thành
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Đã hủy
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.supplierName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Ngày tạo: {format(order.date, "dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                    
                    <div className="col-span-12 flex items-center justify-between sm:col-span-8">
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Sản phẩm:</span>{" "}
                          <span className="font-medium">{order.items.length}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Tổng giảm giá:</span>{" "}
                          <span className="font-medium">{order.totalDiscount.toLocaleString('vi-VN')}đ</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-primary">{order.total.toLocaleString('vi-VN')}đ</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Không tìm thấy đơn hàng nào</h3>
          <p className="mt-2 text-muted-foreground">
            Thay đổi bộ lọc hoặc tạo đơn hàng mới
          </p>
          <Button asChild className="mt-4">
            <Link to="/purchase-orders/create">
              <FilePlus className="mr-2 h-4 w-4" />
              Tạo đơn hàng
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
