
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { suppliers } from "@/utils/supplierMockData";

// Define the schema for our supplier form
const supplierFormSchema = z.object({
  type: z.enum(["individual", "business"]),
  businessName: z.string().optional(),
  ownerName: z.string().min(1, { message: "Tên chủ doanh nghiệp là bắt buộc" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
  address: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
  paymentMethod: z.enum(["cash", "bank_transfer", "credit", "other"]).optional(),
  status: z.enum(["active", "inactive"]),
  note: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

export default function EditSupplier() {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const supplier = suppliers.find(s => s.id === supplierId);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      type: "business",
      status: "active",
    },
  });
  
  useEffect(() => {
    if (supplier) {
      form.reset({
        type: supplier.type,
        businessName: supplier.businessName || "",
        ownerName: supplier.ownerName,
        phone: supplier.phone,
        email: supplier.email || "",
        address: supplier.address,
        contactName: supplier.contactPerson?.name || "",
        contactPhone: supplier.contactPerson?.phone || "",
        contactEmail: supplier.contactPerson?.email || "",
        paymentMethod: supplier.paymentMethod,
        status: supplier.status,
        note: supplier.note || ""
      });
      
      setTags(supplier.tags);
    }
  }, [supplier, form]);
  
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
  
  const supplierType = form.watch("type");
  
  const onSubmit = (data: SupplierFormValues) => {
    // In a real app, this would update the supplier in the database
    console.log({ ...data, tags });
    toast.success("Cập nhật nhà cung cấp thành công!");
    navigate(`/suppliers/${supplierId}`);
  };
  
  const addTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/suppliers/${supplierId}`}>
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Chỉnh sửa nhà cung cấp</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại nhà cung cấp</FormLabel>
                    <FormControl>
                      <Input placeholder="Loại nhà cung cấp" {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      Không thể thay đổi loại nhà cung cấp sau khi đã tạo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {supplierType === "business" && (
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên doanh nghiệp</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên doanh nghiệp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chủ doanh nghiệp</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên chủ doanh nghiệp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FormLabel>Số CCCD</FormLabel>
                  <Input value={supplier.idNumber} disabled />
                  <p className="mt-1 text-sm text-muted-foreground">
                    Không thể thay đổi số CCCD
                  </p>
                </div>
                
                {supplierType === "business" && (
                  <div>
                    <FormLabel>Mã số thuế</FormLabel>
                    <Input value={supplier.taxCode || ""} disabled />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Không thể thay đổi mã số thuế
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
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
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <h3 className="font-medium">Thông tin người liên hệ</h3>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên người liên hệ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên người liên hệ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SĐT người liên hệ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập SĐT người liên hệ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email người liên hệ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email người liên hệ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thông tin mở rộng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phương thức thanh toán</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Tiền mặt</SelectItem>
                          <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                          <SelectItem value="credit">Công nợ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
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
                        value={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Nhãn</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập nhãn và nhấn Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link to={`/suppliers/${supplierId}`}>Hủy</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
