
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { suppliers, purchaseOrders } from "@/utils/supplierMockData";
import { ChevronLeft, Edit, Trash2, FilePlus, CheckCircle, AlertCircle, FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function SupplierDetail() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const supplier = suppliers.find(s => s.id === supplierId);
  
  const supplierOrders = purchaseOrders.filter(order => order.supplierId === supplierId);
  
  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-xl font-semibold">Không tìm thấy nhà cung cấp</h2>
        <Button className="mt-4" asChild>
          <Link to="/suppliers">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }
  
  const handleToggleStatus = () => {
    const newStatus = supplier.status === 'active' ? 'inactive' : 'active';
    toast.success(`Đã chuyển trạng thái nhà cung cấp sang ${newStatus === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}`);
  };
  
  const handleDelete = () => {
    toast.success("Đã xóa nhà cung cấp");
    navigate("/suppliers");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/suppliers">
              <ChevronLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {supplier.businessName || supplier.ownerName}
          </h1>
          <Badge variant={supplier.status === 'active' ? 'outline' : 'destructive'}>
            {supplier.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/purchase-orders/create?supplierId=${supplier.id}`}>
              <FilePlus className="mr-2 h-4 w-4" />
              Tạo đơn hàng
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to={`/suppliers/edit/${supplier.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          
          {supplier.orderCount > 0 ? (
            <Button
              variant={supplier.status === 'active' ? 'destructive' : 'outline'}
              onClick={handleToggleStatus}
            >
              {supplier.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-muted-foreground">Loại hình</div>
                  <div>{supplier.type === 'business' ? 'Doanh nghiệp' : 'Cá nhân'}</div>
                  
                  {supplier.businessName && (
                    <>
                      <div className="text-sm text-muted-foreground">Tên doanh nghiệp</div>
                      <div>{supplier.businessName}</div>
                    </>
                  )}
                  
                  <div className="text-sm text-muted-foreground">Tên chủ doanh nghiệp</div>
                  <div>{supplier.ownerName}</div>
                  
                  <div className="text-sm text-muted-foreground">CCCD</div>
                  <div>{supplier.idNumber}</div>
                  
                  {supplier.taxCode && (
                    <>
                      <div className="text-sm text-muted-foreground">Mã số thuế</div>
                      <div>{supplier.taxCode}</div>
                    </>
                  )}
                  
                  {supplier.paymentMethod && (
                    <>
                      <div className="text-sm text-muted-foreground">Phương thức thanh toán</div>
                      <div>
                        {supplier.paymentMethod === 'cash' ? 'Tiền mặt' : 
                         supplier.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 
                         supplier.paymentMethod === 'credit' ? 'Công nợ' : 'Khác'}
                      </div>
                    </>
                  )}
                  
                  <div className="text-sm text-muted-foreground">Ngày tạo</div>
                  <div>{format(supplier.createdAt, "dd/MM/yyyy", { locale: vi })}</div>
                </div>
                
                {supplier.tags.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground pb-2">Nhãn</div>
                    <div className="flex flex-wrap gap-2">
                      {supplier.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-muted-foreground">Số điện thoại</div>
                  <div>{supplier.phone}</div>
                  
                  {supplier.email && (
                    <>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{supplier.email}</div>
                    </>
                  )}
                  
                  <div className="text-sm text-muted-foreground">Địa chỉ</div>
                  <div>{supplier.address}</div>
                </div>
                
                {supplier.contactPerson && (
                  <>
                    <Separator className="my-4" />
                    <h3 className="font-medium mb-2">Người liên hệ</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      {supplier.contactPerson.name && (
                        <>
                          <div className="text-sm text-muted-foreground">Tên</div>
                          <div>{supplier.contactPerson.name}</div>
                        </>
                      )}
                      
                      {supplier.contactPerson.phone && (
                        <>
                          <div className="text-sm text-muted-foreground">Số điện thoại</div>
                          <div>{supplier.contactPerson.phone}</div>
                        </>
                      )}
                      
                      {supplier.contactPerson.email && (
                        <>
                          <div className="text-sm text-muted-foreground">Email</div>
                          <div>{supplier.contactPerson.email}</div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {supplier.note && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{supplier.note}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="orders" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lịch sử đơn hàng</CardTitle>
              <Button asChild>
                <Link to={`/purchase-orders/create?supplierId=${supplier.id}`}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Tạo đơn hàng
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {supplierOrders.length > 0 ? (
                <div className="space-y-4">
                  {supplierOrders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/purchase-orders/${order.id}`}
                      className="block"
                    >
                      <div className="rounded-lg border p-4 transition-colors hover:bg-muted">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{order.code}</span>
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
                          <div className="text-sm font-medium">
                            {order.total.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                          <span>
                            {format(order.date, "dd/MM/yyyy", { locale: vi })}
                          </span>
                          <span>{order.items.length} sản phẩm</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">Chưa có đơn hàng</h3>
                  <p className="mt-2 text-muted-foreground">
                    Nhà cung cấp này chưa có đơn hàng nào
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to={`/purchase-orders/create?supplierId=${supplier.id}`}>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Tạo đơn hàng đầu tiên
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
