
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/formatters";
import { customerGroups } from "@/utils/customerMockData";
import { Search, Plus, MoreHorizontal, PenLine, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";

export default function CustomerGroupList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  
  // Filter customer groups based on search
  const filteredGroups = customerGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle delete confirmation
  const confirmDelete = (groupId: string) => {
    setGroupToDelete(groupId);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    // In a real app, this would delete the group from the database
    console.log(`Delete group: ${groupToDelete}`);
    toast.success('Đã xóa nhóm khách hàng');
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhóm khách hàng</h1>
        <Button asChild>
          <Link to="/customer-groups/add">
            <Plus className="mr-2 h-4 w-4" />
            Tạo nhóm mới
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhóm khách hàng..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredGroups.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Không tìm thấy nhóm khách hàng nào
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{group.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/customer-groups/edit/${group.id}`} className="flex items-center">
                          <PenLine className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => confirmDelete(group.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa nhóm
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{group.description || "Không có mô tả"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Chiết khấu:</span>
                    <span className="font-medium">
                      {group.isPercentage 
                        ? `${group.discount}%` 
                        : formatCurrency(group.discount)
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Số lượng khách hàng:</span>
                    <Badge variant="secondary">{group.memberCount}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 py-2 text-xs text-muted-foreground">
                Tạo vào: {new Date(group.createdAt).toLocaleDateString('vi-VN')}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Xóa nhóm khách hàng
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhóm khách hàng này? Hành động này không thể hoàn tác.
              Tất cả khách hàng trong nhóm sẽ bị gỡ khỏi nhóm này.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
