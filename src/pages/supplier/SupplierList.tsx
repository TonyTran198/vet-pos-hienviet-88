
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SupplierItem } from "@/components/supplier/SupplierItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { suppliers } from "@/utils/supplierMockData";
import { Supplier, SupplierStatus, PaymentMethod } from "@/lib/types";
import { Search, Plus, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function SupplierList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [filterStatus, setFilterStatus] = useState<SupplierStatus | "all">("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<PaymentMethod | "all">("all");
  const [filterTag, setFilterTag] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>("name_asc");
  
  const allTags = Array.from(new Set(suppliers.flatMap(supplier => supplier.tags)));

  // Apply filters and sorting
  useEffect(() => {
    let result = [...suppliers];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(supplier => 
        supplier.businessName?.toLowerCase().includes(query) ||
        supplier.ownerName.toLowerCase().includes(query) ||
        supplier.phone.includes(query) ||
        supplier.taxCode?.includes(query)
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(supplier => supplier.status === filterStatus);
    }
    
    // Apply payment method filter
    if (filterPaymentMethod !== "all") {
      result = result.filter(supplier => supplier.paymentMethod === filterPaymentMethod);
    }
    
    // Apply tag filter
    if (filterTag) {
      result = result.filter(supplier => supplier.tags.includes(filterTag));
    }
    
    // Apply date filter
    if (filterDate) {
      result = result.filter(supplier => {
        const supplierDate = new Date(supplier.createdAt);
        return supplierDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case "name_asc":
        result.sort((a, b) => (a.businessName || a.ownerName).localeCompare(b.businessName || b.ownerName));
        break;
      case "name_desc":
        result.sort((a, b) => (b.businessName || b.ownerName).localeCompare(a.businessName || a.ownerName));
        break;
      case "recent":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "orders":
        result.sort((a, b) => b.orderCount - a.orderCount);
        break;
    }
    
    setFilteredSuppliers(result);
  }, [searchQuery, filterStatus, filterPaymentMethod, filterTag, filterDate, sortOption]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPaymentMethod("all");
    setFilterTag("");
    setFilterDate(undefined);
    setSortOption("name_asc");
  };

  // Count active filters
  const activeFilterCount = [
    filterStatus !== "all",
    filterPaymentMethod !== "all",
    !!filterTag,
    !!filterDate
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhà cung cấp</h1>
        <Button asChild>
          <Link to="/suppliers/add"><Plus size={16} className="mr-2" /> Thêm nhà cung cấp</Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT, mã số thuế..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter size={16} />
                Lọc
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Bộ lọc</h4>
                <Separator />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <Select
                    value={filterStatus}
                    onValueChange={(value) => setFilterStatus(value as SupplierStatus | "all")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phương thức thanh toán</label>
                  <Select
                    value={filterPaymentMethod}
                    onValueChange={(value) => setFilterPaymentMethod(value as PaymentMethod | "all")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả phương thức</SelectItem>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                      <SelectItem value="credit">Công nợ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nhãn</label>
                  <Select
                    value={filterTag}
                    onValueChange={setFilterTag}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả nhãn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả nhãn</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày tạo</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDate ? format(filterDate, "dd/MM/yyyy") : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filterDate}
                        onSelect={setFilterDate}
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button variant="ghost" className="w-full" onClick={resetFilters}>
                  <X size={16} className="mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sắp xếp theo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Tên: A-Z</SelectItem>
              <SelectItem value="name_desc">Tên: Z-A</SelectItem>
              <SelectItem value="recent">Mới nhất</SelectItem>
              <SelectItem value="orders">Số đơn hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredSuppliers.length > 0 ? (
        <div className="space-y-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierItem key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Không tìm thấy nhà cung cấp</h3>
          <p className="mt-2 text-muted-foreground">
            Thay đổi bộ lọc hoặc thêm nhà cung cấp mới
          </p>
          <Button asChild className="mt-4">
            <Link to="/suppliers/add"><Plus size={16} className="mr-2" /> Thêm nhà cung cấp</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
