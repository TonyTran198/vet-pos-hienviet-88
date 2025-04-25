
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customers } from '@/utils/customerMockData';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerStatus } from '@/lib/types';

const editCustomerSchema = z.object({
  name: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ").optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

export default function EditCustomer() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) {
    return <div>Không tìm thấy khách hàng</div>;
  }
  
  const form = useForm<z.infer<typeof editCustomerSchema>>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email || '',
      address: customer.address || '',
      status: customer.status as CustomerStatus
    }
  });

  const onSubmit = (data: z.infer<typeof editCustomerSchema>) => {
    // Simulated customer update
    toast.success('Đã cập nhật thông tin khách hàng');
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chỉnh sửa khách hàng</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên khách hàng *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên khách hàng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <label className="text-sm font-medium">Số điện thoại</label>
            <Input value={customer.phone} disabled className="mt-1" />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <div className="flex gap-4">
            <Button type="submit">Lưu thay đổi</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/customers/${customerId}`)}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
