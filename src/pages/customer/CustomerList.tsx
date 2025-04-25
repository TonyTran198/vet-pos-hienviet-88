
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomerItem } from "@/components/customer/CustomerItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { customers as mockCustomers, customerGroups } from "@/utils/customerMockData";
import { Customer, CustomerStatus } from "@/lib/types";
import { Search, Plus, Filter, X } from "lucide-react";

// Transform mock data to match Customer type
const customers: Customer[] = mockCustomers.map(customer => ({
  ...customer,
  createdAt: new Date(customer.createdAt),
  // Add any missing fields with default values
  status: customer.status as CustomerStatus,
  tags: customer.tags || [],
  orderCount: customer.orderCount || 0,
}));

export default function CustomerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [filterStatus, setFilterStatus] = useState<CustomerStatus | "all">("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("");
  
  const allTags = Array.from(new Set(customers.flatMap(customer => customer.tags)));

  // Apply filters and sorting
  useEffect(() => {
    let result = [...customers];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        (customer.email && customer.email.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(customer => customer.status === filterStatus);
    }
    
    // Apply group filter
    if (filterGroup !== "all") {
      result = result.filter(customer => customer.groupId === filterGroup);
    }
    
    // Apply tag filter
    if (filterTag) {
      result = result.filter(customer => customer.tags.includes(filterTag));
    }
    
    setFilteredCustomers(result);
  }, [searchQuery, filterStatus, filterGroup, filterTag]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterGroup("all");
    setFilterTag("");
  };

  // Count active filters
  const activeFilterCount = [
    filterStatus !== "all",
    filterGroup !== "all",
    !!filterTag
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <Button asChild>
          <Link to="/customers/add"><Plus size={16} className="mr-2" /> Thêm khách hàng</Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT, email..."
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
                    onValueChange={(value) => setFilterStatus(value as CustomerStatus | "all")}
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
                  <label className="text-sm font-medium">Nhóm khách hàng</label>
                  <Select
                    value={filterGroup}
                    onValueChange={setFilterGroup}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả nhóm</SelectItem>
                      {customerGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {allTags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tag</label>
                    <Select
                      value={filterTag}
                      onValueChange={setFilterTag}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả tag</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={resetFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy khách hàng nào
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerItem key={customer.id} customer={customer} />
          ))
        )}
      </div>
    </div>
  );
}
