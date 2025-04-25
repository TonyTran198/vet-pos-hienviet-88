
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { customers } from '@/utils/customerMockData';

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) {
    return <div>Không tìm thấy khách hàng</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chi tiết khách hàng</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/customers/edit/${customerId}`)}
          >
            Chỉnh sửa
          </Button>
          <Button onClick={() => navigate('/customers')}>Quay lại</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{customer.name}</CardTitle>
            <Badge variant={customer.status === 'active' ? 'outline' : 'destructive'}>
              {customer.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-muted-foreground">Số điện thoại:</span> {customer.phone}
          </div>
          
          {customer.email && (
            <div>
              <span className="text-muted-foreground">Email:</span> {customer.email}
            </div>
          )}
          
          {customer.address && (
            <div>
              <span className="text-muted-foreground">Địa chỉ:</span> {customer.address}
            </div>
          )}
          
          <div>
            <span className="text-muted-foreground">Tổng số đơn hàng:</span> {customer.orderCount}
          </div>
          
          {customer.discount !== undefined && (
            <div>
              <span className="text-muted-foreground">Chiết khấu:</span>{' '}
              {customer.isPercentage ? `${customer.discount}%` : `${customer.discount.toLocaleString('vi-VN')}đ`}
            </div>
          )}
          
          {customer.tags.length > 0 && (
            <div className="flex gap-2">
              <span className="text-muted-foreground">Nhãn:</span>
              {customer.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
