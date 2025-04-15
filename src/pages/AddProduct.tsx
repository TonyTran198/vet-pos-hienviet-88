
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/utils/mockData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";

const formSchema = z.object({
  scientificName: z.string().min(1, { message: "Tên danh pháp là bắt buộc" }),
  commonName: z.string().optional(),
  categoryId: z.string().min(1, { message: "Danh mục là bắt buộc" }),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  unit: z.string().optional(),
  tags: z.string().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().default(0),
  costPrice: z.coerce.number().min(0, { message: "Giá nhập phải lớn hơn hoặc bằng 0" }),
  sellingPrice: z.coerce.number().min(0, { message: "Giá bán phải lớn hơn hoặc bằng 0" }),
  uses: z.string().optional(),
  ingredients: z.string().optional(),
  status: z.boolean().default(true),
  notes: z.string().optional(),
});

export default function AddProduct() {
  const [isPriceWarning, setIsPriceWarning] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scientificName: "",
      commonName: "",
      categoryId: "",
      barcode: "",
      sku: "",
      unit: "",
      tags: "",
      description: "",
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      uses: "",
      ingredients: "",
      status: true,
      notes: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if selling price is less than cost price
    if (values.sellingPrice < values.costPrice) {
      setIsPriceWarning(true);
      return;
    }

    // In a real app, this would save the product to the database
    console.log(values);
    
    // Show success message
    toast.success("Sản phẩm đã được thêm thành công!");
    
    // Navigate back to products list
    navigate("/products");
  }

  // Watch for price changes to reset warning
  const costPrice = form.watch("costPrice");
  const sellingPrice = form.watch("sellingPrice");
  
  // Reset price warning when prices change
  useEffect(() => {
    if (Number(sellingPrice) >= Number(costPrice)) {
      setIsPriceWarning(false);
    }
  }, [costPrice, sellingPrice]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
          <p className="text-muted-foreground">Nhập thông tin sản phẩm</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Thông tin cơ bản</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="scientificName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh pháp *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên danh pháp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="commonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thông dụng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên thông dụng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã vạch</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã vạch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị tính</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Viên, Chai, Lọ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Giá & Số lượng</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá nhập *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const costPriceValue = parseFloat(e.target.value);
                          const sellingPriceValue = form.getValues("sellingPrice");
                          if (
                            costPriceValue > sellingPriceValue &&
                            sellingPriceValue !== 0
                          ) {
                            setIsPriceWarning(true);
                          } else {
                            setIsPriceWarning(false);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        className={isPriceWarning ? "border-warning" : ""}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const sellingPriceValue = parseFloat(e.target.value);
                          const costPriceValue = form.getValues("costPrice");
                          if (
                            sellingPriceValue < costPriceValue &&
                            costPriceValue !== 0
                          ) {
                            setIsPriceWarning(true);
                          } else {
                            setIsPriceWarning(false);
                          }
                        }}
                      />
                    </FormControl>
                    {isPriceWarning && (
                      <p className="text-xs font-medium text-warning">
                        Giá bán thấp hơn giá nhập
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Thông tin chi tiết</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (phân cách bằng dấu phẩy)</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: kháng sinh, giảm đau" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Trạng thái sản phẩm</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {field.value ? "Đang hoạt động" : "Không hoạt động"}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công dụng</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập công dụng sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thành phần</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập thành phần sản phẩm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
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
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Lưu sản phẩm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
