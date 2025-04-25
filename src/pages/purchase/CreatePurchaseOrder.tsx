
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronLeft, Plus, Trash2, AlertCircle, Save, FileCheck } from "lucide-react";
import { suppliers, generatePurchaseOrderCode } from "@/utils/supplierMockData";
import { products } from "@/utils/mockData";
import { PurchaseOrderItem } from "@/lib/types";

// Form schema
const purchaseOrderFormSchema = z.object({
  supplierId: z.string({
    required_error: "Vui lòng chọn nhà cung cấp",
  }),
  note: z.string().optional(),
  status: z.enum(["draft", "final"], {
    required_error: "Vui lòng chọn loại đơn hàng",
  }),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSupplierId = searchParams.get("supplierId");
  
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      supplierId: preselectedSupplierId || "",
      status: "final",
    },
  });
  
  // Calculate order totals
  const subTotal = items.reduce((sum, item) => sum + item.subTotal, 0);
  const totalDiscount = items.reduce((sum, item) => {
    const itemDiscount = item.isPercentage 
      ? (item.unitPrice * item.quantity * item.discount / 100)
      : item.discount;
    return sum + itemDiscount;
  }, 0);
  const total = subTotal - totalDiscount;
  
  // Filter products based on search query
  useEffect(() => {
    if (searchProduct) {
      const query = searchProduct.toLowerCase();
      const filtered = products.filter(
        p => p.scientificName.toLowerCase().includes(query) ||
             p.commonName.toLowerCase().includes(query) ||
             p.barcode.includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchProduct]);
  
  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already exists in items
    const existingItem = items.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity of existing item
      setItems(items.map(item => 
        item.productId === productId 
          ? { 
              ...item, 
              quantity: item.quantity + 1, 
              subTotal: (item.quantity + 1) * item.unitPrice * (1 - (item.isPercentage ? item.discount / 100 : 0))
            }
          : item
      ));
    } else {
      // Add new item
      const newItem: PurchaseOrderItem = {
        id: `item-${Date.now()}`,
        productId,
        scientificName: product.scientificName,
        commonName: product.commonName,
        quantity: 1,
        unitPrice: product.costPrice,
        discount: 0,
        isPercentage: true,
        subTotal: product.costPrice,
        note: ""
      };
      
      setItems([...items, newItem]);
    }
    
    setSearchProduct("");
  };
  
  const updateItem = (id: string, field: keyof PurchaseOrderItem, value: number | boolean) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
        
        // Recalculate subTotal
        const discountAmount = updatedItem.isPercentage 
          ? (updatedItem.unitPrice * updatedItem.quantity * updatedItem.discount / 100)
          : updatedItem.discount;
        
        updatedItem.subTotal = updatedItem.unitPrice * updatedItem.quantity - discountAmount;
        
        return updatedItem;
      }
      return item;
    }));
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const onSubmit = (data: PurchaseOrderFormValues) => {
    if (items.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng");
      return;
    }
    
    const orderData = {
      ...data,
      code: generatePurchaseOrderCode(),
      items,
      subTotal,
      totalDiscount,
      total,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log("Order data:", orderData);
    
    const successMessage = data.status === "draft" 
      ? "Đã lưu đơn hàng nháp thành công"
      : "Đã tạo đơn hàng thành công và cập nhật tồn kho";
      
    toast.success(successMessage);
    navigate("/purchase-orders");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/purchase-orders">
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tạo đơn nhập hàng</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhà cung cấp</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhà cung cấp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers
                          .filter(s => s.status === 'active')
                          .map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.businessName || supplier.ownerName}
                          </SelectItem>
                        ))}
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
                    <FormLabel>Loại đơn hàng</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại đơn hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Đơn nháp (không cập nhật tồn kho)</SelectItem>
                        <SelectItem value="final">Đơn thật (cập nhật tồn kho)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Thêm sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  placeholder="Tìm sản phẩm theo tên, mã vạch..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="mb-2"
                />
                
                {filteredProducts.length > 0 && searchProduct && (
                  <div className="absolute z-10 w-full rounded-md border bg-background shadow-md">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div 
                        key={product.id}
                        className="flex cursor-pointer items-center justify-between border-b p-2 hover:bg-muted"
                        onClick={() => addProduct(product.id)}
                      >
                        <div>
                          <p className="font-medium">{product.scientificName}</p>
                          {product.commonName && (
                            <p className="text-sm text-muted-foreground">{product.commonName}</p>
                          )}
                        </div>
                        <div className="text-sm">
                          <p>{product.costPrice.toLocaleString('vi-VN')}đ</p>
                          <p className="text-muted-foreground">Tồn: {product.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {items.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-2">Sản phẩm</th>
                        <th className="pb-2">Số lượng</th>
                        <th className="pb-2">Đơn giá</th>
                        <th className="pb-2">Giảm giá</th>
                        <th className="pb-2">Kiểu</th>
                        <th className="pb-2 text-right">Thành tiền</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{item.scientificName}</p>
                              {item.commonName && (
                                <p className="text-sm text-muted-foreground">{item.commonName}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <Input 
                              type="number"
                              min="1"
                              className="w-20"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="py-3">
                            <Input 
                              type="number"
                              min="0"
                              className="w-28"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, "unitPrice", parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="py-3">
                            <Input 
                              type="number"
                              min="0"
                              className="w-20"
                              value={item.discount}
                              onChange={(e) => updateItem(item.id, "discount", parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="py-3">
                            <Select 
                              value={item.isPercentage ? "percent" : "amount"} 
                              onValueChange={(value) => updateItem(item.id, "isPercentage", value === "percent")}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percent">%</SelectItem>
                                <SelectItem value="amount">VNĐ</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 text-right font-medium">
                            {item.subTotal.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-4 flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiền hàng:</span>
                        <span>{subTotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Giảm giá:</span>
                        <span>- {totalDiscount.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Tổng thanh toán:</span>
                        <span className="font-bold text-primary">{total.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-10">
                  <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Chưa có sản phẩm</h3>
                  <p className="mt-1 text-center text-muted-foreground">
                    Tìm và thêm sản phẩm vào đơn hàng
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link to="/purchase-orders">Hủy</Link>
            </Button>
            <Button 
              type="submit"
              onClick={() => form.setValue("status", "draft")}
              variant="secondary"
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu nháp
            </Button>
            <Button 
              type="submit"
              onClick={() => form.setValue("status", "final")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Tạo đơn hàng
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
