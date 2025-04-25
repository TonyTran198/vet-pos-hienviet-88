
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Plus, Barcode, Save, FileDown } from "lucide-react";
import { suppliers } from "@/utils/supplierMockData";
import { products } from "@/utils/mockData";
import { formatCurrency } from "@/utils/formatters";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [supplierId, setSupplierId] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [items, setItems] = useState<Array<{
    productId: string;
    quantity: number;
    price: number;
    discount: number;
    isPercentage: boolean;
    note: string;
  }>>([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [isPercentage, setIsPercentage] = useState(true);
  const [note, setNote] = useState("");
  
  // Calculate subtotal (before any discounts)
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Calculate line discounts
  const lineDiscounts = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    return sum + (item.isPercentage ? 
      (itemTotal * (item.discount / 100)) : 
      (item.discount > itemTotal ? itemTotal : item.discount));
  }, 0);
  
  // Calculate total discount
  const finalDiscount = lineDiscounts + (isPercentage ? 
    (subtotal - lineDiscounts) * (totalDiscount / 100) : 
    Math.min(totalDiscount, subtotal - lineDiscounts));
  
  // Calculate grand total
  const grandTotal = subtotal - finalDiscount;
  
  // Handle adding a product to the order
  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    setItems(prev => [
      ...prev,
      {
        productId,
        quantity: 1,
        price: product.costPrice,
        discount: 0,
        isPercentage: true,
        note: ""
      }
    ]);
  };
  
  // Handle removing a product from the order
  const removeProduct = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle updating item properties
  const updateItem = (index: number, field: string, value: number | string | boolean) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };
  
  // Handle saving the purchase order
  const savePurchaseOrder = (asDraft: boolean) => {
    if (!supplierId) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Vui lòng thêm sản phẩm vào đơn hàng");
      return;
    }
    
    // In a real app, this would save the purchase order to the database
    console.log({
      supplierId,
      items,
      totalDiscount,
      isPercentage,
      subtotal,
      finalDiscount,
      grandTotal,
      status: asDraft ? 'draft' : 'completed',
      note
    });
    
    toast.success(`Đã ${asDraft ? 'lưu nháp' : 'tạo'} đơn nhập hàng thành công`);
    navigate("/purchase-orders");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/purchase-orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Tạo đơn nhập hàng mới</h1>
            <p className="text-muted-foreground">
              {isDraft ? "Đơn nháp (không cập nhật tồn kho)" : "Đơn thật (sẽ cập nhật tồn kho)"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/purchase-orders")}>
            Hủy
          </Button>
          <Button variant="outline" onClick={() => savePurchaseOrder(true)}>
            <Save className="mr-2 h-4 w-4" />
            Lưu nháp
          </Button>
          <Button onClick={() => savePurchaseOrder(false)}>
            <FileDown className="mr-2 h-4 w-4" />
            Tạo đơn
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">
                  <Barcode className="mr-2 h-4 w-4" />
                  Quét mã vạch
                </Button>
                <Select onValueChange={addProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Thêm sản phẩm..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.scientificName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {items.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="w-[100px]">SL</TableHead>
                        <TableHead className="w-[120px]">Giá</TableHead>
                        <TableHead className="w-[150px]">Chiết khấu</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => {
                        const product = products.find(p => p.id === item.productId);
                        const lineTotal = item.price * item.quantity;
                        const discount = item.isPercentage ? 
                          lineTotal * (item.discount / 100) : 
                          Math.min(item.discount, lineTotal);
                        const finalLineTotal = lineTotal - discount;
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product?.scientificName}</div>
                                <div className="text-xs text-muted-foreground">{product?.commonName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                min="1" 
                                value={item.quantity} 
                                onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                min="0" 
                                value={item.price} 
                                onChange={e => updateItem(index, 'price', parseInt(e.target.value) || 0)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Input 
                                  type="number" 
                                  min="0" 
                                  value={item.discount} 
                                  onChange={e => updateItem(index, 'discount', parseInt(e.target.value) || 0)}
                                  className="w-full"
                                />
                                <Select
                                  value={item.isPercentage ? "percent" : "value"}
                                  onValueChange={(val) => updateItem(index, 'isPercentage', val === "percent")}
                                >
                                  <SelectTrigger className="w-[60px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="percent">%</SelectItem>
                                    <SelectItem value="value">VND</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(finalLineTotal)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeProduct(index)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">Không có sản phẩm</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Thêm sản phẩm vào đơn hàng bằng cách quét mã vạch hoặc chọn từ danh sách.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Nhà cung cấp *</Label>
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Chọn nhà cung cấp" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.businessName || supplier.ownerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Loại đơn</Label>
                  <Select 
                    value={isDraft ? "draft" : "final"}
                    onValueChange={(val) => setIsDraft(val === "draft")}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn loại đơn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Đơn nháp (không cập nhật kho)</SelectItem>
                      <SelectItem value="final">Đơn thật (cập nhật kho)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Đơn nháp không ảnh hưởng đến tồn kho hiện tại.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Chiết khấu bổ sung</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      min="0"
                      value={totalDiscount}
                      onChange={e => setTotalDiscount(parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                    <Select
                      value={isPercentage ? "percent" : "value"}
                      onValueChange={(val) => setIsPercentage(val === "percent")}
                    >
                      <SelectTrigger className="w-[60px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">%</SelectItem>
                        <SelectItem value="value">VND</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Nhập ghi chú cho đơn hàng này..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Separator className="mb-4" />
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chiết khấu dòng:</span>
                  <span>-{formatCurrency(lineDiscounts)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chiết khấu bổ sung:</span>
                  <span>-{formatCurrency(finalDiscount - lineDiscounts)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-lg">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
