
import { Link } from "react-router-dom";
import { Supplier } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SupplierItemProps {
  supplier: Supplier;
}

export function SupplierItem({ supplier }: SupplierItemProps) {
  const handleDeleteSupplier = () => {
    // In a real app, this would delete the supplier
    toast.success(`Đã xóa nhà cung cấp: ${supplier.businessName || supplier.ownerName}`);
  };

  const handleToggleStatus = () => {
    const newStatus = supplier.status === 'active' ? 'inactive' : 'active';
    // In a real app, this would update the supplier status
    toast.success(`Đã chuyển trạng thái nhà cung cấp sang ${newStatus === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-7">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {supplier.businessName || supplier.ownerName}
              </h3>
              <Badge variant={supplier.status === 'active' ? 'outline' : 'destructive'} className="text-xs">
                {supplier.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {supplier.type === 'business' ? 'Doanh nghiệp' : 'Cá nhân'}
            </p>
            <p className="mt-1 text-sm">
              <span className="text-muted-foreground">SĐT:</span> {supplier.phone}
            </p>
            {supplier.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {supplier.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="col-span-12 flex items-center justify-between sm:col-span-5">
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Tổng đơn nhập:</span>{" "}
                <span className="font-medium">{supplier.orderCount}</span>
              </p>
              {supplier.paymentMethod && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Thanh toán:</span>{" "}
                  <span className="font-medium">
                    {supplier.paymentMethod === 'cash' ? 'Tiền mặt' : 
                     supplier.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 
                     supplier.paymentMethod === 'credit' ? 'Công nợ' : 'Khác'}
                  </span>
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to={`/suppliers/${supplier.id}`}>
                  <Eye size={16} />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={`/suppliers/edit/${supplier.id}`}>
                  <Edit size={16} />
                </Link>
              </Button>
              
              {supplier.orderCount > 0 ? (
                <Button
                  size="sm"
                  variant={supplier.status === 'active' ? 'destructive' : 'outline'}
                  onClick={handleToggleStatus}
                >
                  {supplier.status === 'active' ? 'Ngừng' : 'Kích hoạt'}
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 size={16} />
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
                      <AlertDialogAction onClick={handleDeleteSupplier}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
