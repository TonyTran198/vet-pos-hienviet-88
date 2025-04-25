
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { customerGroups } from "@/utils/customerMockData";
import { Search, Plus, Edit, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function CustomerGroupList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredGroups = customerGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleDeleteGroup = (id: string) => {
    toast.success("Đã xóa nhóm khách hàng thành công");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhóm khách hàng</h1>
        <Button asChild>
          <Link to="/customer-groups/add"><Plus size={16} className="mr-2" /> Tạo nhóm mới</Link>
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm nhóm theo tên..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredGroups.length > 0 ? (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-8">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      <Badge variant="secondary">
                        {group.customerCount} khách hàng
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                    <p className="mt-2 text-sm">
                      <span className="text-muted-foreground">Chính sách giảm giá:</span>{" "}
                      <span className="font-medium">
                        {group.isPercentage ? `${group.discount}%` : `${group.discount.toLocaleString('vi-VN')}đ`}
                      </span>
                    </p>
                  </div>
                  
                  <div className="col-span-12 flex items-center justify-between sm:col-span-4">
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customer-groups/edit/${group.id}`}>
                          <Edit size={16} className="mr-2" />
                          Chỉnh sửa
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 size={16} className="mr-2" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa nhóm</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa nhóm khách hàng này? Các khách hàng trong nhóm sẽ không còn thuộc nhóm này nữa.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteGroup(group.id)}>Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Không tìm thấy nhóm khách hàng</h3>
          <p className="mt-2 text-muted-foreground">
            Tạo nhóm khách hàng mới và thiết lập chính sách giảm giá
          </p>
          <Button asChild className="mt-4">
            <Link to="/customer-groups/add"><Plus size={16} className="mr-2" /> Tạo nhóm mới</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
