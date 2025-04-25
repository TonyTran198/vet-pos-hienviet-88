
import { Link } from "react-router-dom";
import { Customer } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface CustomerItemProps {
  customer: Customer;
}

export function CustomerItem({ customer }: CustomerItemProps) {
  const handleDeleteCustomer = () => {
    // In a real app, this would delete the customer
    toast.success(`Đã xóa khách hàng: ${customer.name}`);
  };

  const handleToggleStatus = () => {
    const newStatus = customer.status === 'active' ? 'inactive' : 'active';
    // In a real app, this would update the customer status
    toast.success(`Đã chuyển trạng thái khách hàng sang ${newStatus === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-7">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{customer.name}</h3>
              <Badge variant={customer.status === 'active' ? 'outline' : 'destructive'} className="text-xs">
                {customer.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
              </Badge>
            </div>
            <p className="mt-1 text-sm">
              <span className="text-muted-foreground">SĐT:</span> {customer.phone}
            </p>
            {customer.email && (
              <p className="text-sm text-muted-foreground">
                {customer.email}
              </p>
            )}
            {customer.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {customer.tags.map((tag) => (
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
                <span className="text-muted-foreground">Tổng đơn:</span>{" "}
                <span className="font-medium">{customer.orderCount}</span>
              </p>
              {customer.discount !== undefined && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Giảm giá:</span>{" "}
                  <span className="font-medium">
                    {customer.isPercentage ? `${customer.discount}%` : `${customer.discount.toLocaleString('vi-VN')}đ`}
                  </span>
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to={`/customers/${customer.id}`}>
                  <Eye size={16} />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={`/customers/edit/${customer.id}`}>
                  <Edit size={16} />
                </Link>
              </Button>
              
              {customer.orderCount > 0 ? (
                <Button
                  size="sm"
                  variant={customer.status === 'active' ? 'destructive' : 'outline'}
                  onClick={handleToggleStatus}
                >
                  {customer.status === 'active' ? 'Ngừng' : 'Kích hoạt'}
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
                        Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCustomer}>Xóa</AlertDialogAction>
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
