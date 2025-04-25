
import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, User } from 'lucide-react';
import { customers, customerGroups } from '@/utils/customerMockData';
import { formatCurrency } from '@/utils/formatters';

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) {
    return <div>Không tìm thấy khách hàng</div>;
  }
  
  // Find customer's group if exists
  const customerGroup = customer.groupId ? 
    customerGroups.find(g => g.id === customer.groupId) : null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
        
        <Button asChild>
          <Link to={`/customers/edit/${customer.id}`}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Tên khách hàng</p>
                <p className="text-muted-foreground">{customer.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Số điện thoại</p>
                <p className="text-muted-foreground">{customer.phone}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{customer.email || "—"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Địa chỉ</p>
                <p className="text-muted-foreground">{customer.address || "—"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Nhóm khách hàng</p>
                {customerGroup ? (
                  <Link to={`/customer-groups/edit/${customerGroup.id}`}>
                    <Badge variant="outline">{customerGroup.name}</Badge>
                  </Link>
                ) : (
                  <p className="text-muted-foreground">—</p>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium">Trạng thái</p>
                <Badge variant={customer.status === 'active' ? "default" : "secondary"}>
                  {customer.status === 'active' ? "Hoạt động" : "Ngừng hoạt động"}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">Ngày tạo</p>
                <p className="text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Đơn hàng gần nhất</p>
                <p className="text-muted-foreground">
                  {customer.lastOrderDate ? 
                    new Date(customer.lastOrderDate).toLocaleDateString('vi-VN') : 
                    "Chưa có đơn hàng"}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {customer.tags.length > 0 ? 
                  customer.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  )) : 
                  <p className="text-muted-foreground">Không có tags</p>
                }
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{customer.orderCount}</p>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                <p className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</p>
              </div>
            </div>
            
            <Tabs defaultValue="orders">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Đơn hàng gần đây</TabsTrigger>
                <TabsTrigger value="activity">Hoạt động</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4 pt-4">
                <div className="text-center py-6 text-muted-foreground">
                  <p>Không có dữ liệu đơn hàng</p>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4 pt-4">
                <div className="text-center py-6 text-muted-foreground">
                  <p>Không có hoạt động gần đây</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
