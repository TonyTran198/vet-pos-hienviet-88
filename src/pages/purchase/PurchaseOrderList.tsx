
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { purchaseOrders } from "@/utils/purchaseOrderMockData";
import { suppliers } from "@/utils/supplierMockData";
import { formatCurrency } from "@/utils/formatters";
import { PlusCircle, Search, Calendar, FileDown } from "lucide-react";

export default function PurchaseOrderList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter purchase orders based on search and filters
  const filteredOrders = purchaseOrders.filter(order => {
    // Apply search filter
    if (searchQuery && !order.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply supplier filter
    if (supplierFilter !== "all" && order.supplierId !== supplierFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách đơn nhập hàng</h1>
        <Button asChild>
          <Link to="/purchase-orders/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo đơn nhập hàng
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn hàng..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nhà cung cấp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhà cung cấp</SelectItem>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.businessName || supplier.ownerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy đơn nhập hàng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const supplier = suppliers.find(s => s.id === order.supplierId);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.code}</TableCell>
                    <TableCell>{supplier?.businessName || supplier?.ownerName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'completed' ? "default" : "secondary"}>
                        {order.status === 'completed' ? 'Hoàn thành' : 'Nháp'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/purchase-orders/${order.id}`}>
                          Chi tiết
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
