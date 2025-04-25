
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, CustomerStatus } from '@/lib/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const customerSchema = z.object({
  name: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

export default function AddCustomer() {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      status: 'active'
    }
  });

  const onSubmit = (data: z.infer<typeof customerSchema>) => {
    // Simulated customer creation 
    toast.success('Đã thêm khách hàng mới');
    navigate('/customers');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Thêm khách hàng mới</h1>
      
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
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
            <Button type="submit">Thêm khách hàng</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/customers')}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
