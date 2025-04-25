
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { purchaseOrders } from "@/utils/supplierMockData";
import {
  ChevronLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Printer,
  Download,
  FilePlus,
  ArrowRight
} from "lucide-react";

export default function PurchaseOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = purchaseOrders.find(o => o.id === orderId);
  
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-xl font-semibold">Không tìm thấy đơn hàng</h2>
        <Button className="mt-4" asChild>
          <Link to="/purchase-orders">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }
  
  const handleExport = () => {
    toast.success("Đã xuất đơn hàng thành công");
  };
  
  const handlePrint = () => {
    toast.success("Đang chuẩn bị in đơn hàng");
  };
  
  const handleStatusChange = (newStatus: string) => {
    toast.success(`Đã chuyển trạng thái đơn hàng sang ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/purchase-orders">
              <ChevronLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{order.code}</h1>
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
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            In
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
          {order.status === 'draft' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Chuyển sang đơn thật
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận chuyển đổi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Chuyển đơn hàng nháp thành đơn hàng thật sẽ cập nhật số lượng tồn kho. Bạn có chắc chắn muốn tiếp tục?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleStatusChange('Hoàn thành')}>
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">{order.supplierName}</p>
              <Link 
                to={`/suppliers/${order.supplierId}`} 
                className="mt-1 flex items-center gap-1 text-primary hover:underline"
              >
                Xem chi tiết
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn:</span>
                <span className="font-medium">{order.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span>{format(order.date, "dd/MM/yyyy", { locale: vi })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span>
                  {order.status === 'draft' ? 'Nháp' : 
                   order.status === 'final' ? 'Hoàn thành' : 'Đã hủy'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổng tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiền hàng:</span>
                <span>{order.subTotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giảm giá:</span>
                <span>- {order.totalDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Tổng thanh toán:</span>
                <span className="text-primary">{order.total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-2">Sản phẩm</th>
                  <th className="pb-2">Số lượng</th>
                  <th className="pb-2">Đơn giá</th>
                  <th className="pb-2">Giảm giá</th>
                  <th className="pb-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{item.scientificName}</p>
                        {item.commonName && (
                          <p className="text-sm text-muted-foreground">{item.commonName}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4">{item.quantity}</td>
                    <td className="py-4">{item.unitPrice.toLocaleString('vi-VN')}đ</td>
                    <td className="py-4">
                      {item.discount > 0
                        ? item.isPercentage
                          ? `${item.discount}%`
                          : `${item.discount.toLocaleString('vi-VN')}đ`
                        : "-"}
                    </td>
                    <td className="py-4 text-right">{item.subTotal.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="pt-4 text-right font-medium">
                    Tổng tiền hàng:
                  </td>
                  <td className="pt-4 text-right font-medium">
                    {order.subTotal.toLocaleString('vi-VN')}đ
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="pt-2 text-right font-medium">
                    Tổng giảm giá:
                  </td>
                  <td className="pt-2 text-right font-medium">
                    - {order.totalDiscount.toLocaleString('vi-VN')}đ
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="pt-2 text-right font-semibold text-lg">
                    Tổng thanh toán:
                  </td>
                  <td className="pt-2 text-right font-semibold text-lg text-primary">
                    {order.total.toLocaleString('vi-VN')}đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {order.note && (
        <Card>
          <CardHeader>
            <CardTitle>Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
