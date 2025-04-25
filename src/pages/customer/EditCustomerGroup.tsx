
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";
import { customers, customerGroups } from "@/utils/customerMockData";

export default function EditCustomerGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  // Find the group from mock data
  const group = customerGroups.find(g => g.id === groupId);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState<string>('5');
  const [isPercentage, setIsPercentage] = useState(true);
  const [selectionMethod, setSelectionMethod] = useState('manual');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [minOrderCount, setMinOrderCount] = useState<string>('5');
  const [minSpend, setMinSpend] = useState<string>('1000000');
  const [customerTag, setCustomerTag] = useState('');

  // Load group data when component mounts
  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description || '');
      setDiscount(group.discount.toString()); // Convert number to string
      setIsPercentage(group.isPercentage);
      
      // Get customers that belong to this group
      const customersInGroup = customers.filter(c => c.groupId === groupId).map(c => c.id);
      setSelectedCustomers(customersInGroup);
      
      // Check if there are conditions for auto-selection
      if (group.conditions?.length) {
        setSelectionMethod('auto');
        
        // Set condition values
        group.conditions.forEach(condition => {
          if (condition.type === 'min_orders') {
            setMinOrderCount(condition.value.toString()); // Convert number to string
          } else if (condition.type === 'min_spend') {
            setMinSpend(condition.value.toString()); // Convert number to string
          } else if (condition.type === 'tag') {
            setCustomerTag(condition.value);
          }
        });
      }
    }
  }, [group, groupId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Vui lòng nhập tên nhóm khách hàng');
      return;
    }
    
    toast.success('Đã cập nhật nhóm khách hàng thành công');
    navigate('/customer-groups');
  };
  
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  // If the group doesn't exist, show an error message
  if (!group) {
    return <div>Không tìm thấy nhóm khách hàng</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/customer-groups')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Chỉnh sửa nhóm khách hàng</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/customer-groups')}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" /> Lưu thay đổi
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhóm</CardTitle>
          <CardDescription>
            Chỉnh sửa thông tin cơ bản của nhóm khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên nhóm <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VIP / Thường xuyên / Mua số lượng lớn..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả nhóm</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả về nhóm khách hàng này..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Chính sách chiết khấu</Label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select
                    value={isPercentage ? "percent" : "value"}
                    onValueChange={(val) => setIsPercentage(val === "percent")}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="value">VND</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quản lý khách hàng trong nhóm</CardTitle>
          <CardDescription>
            Chỉnh sửa phương thức lựa chọn khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectionMethod} onValueChange={setSelectionMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Chọn thủ công</TabsTrigger>
              <TabsTrigger value="auto">Chọn tự động theo điều kiện</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4 pt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Chọn khách hàng bạn muốn thêm vào nhóm này
                </p>
                
                <div className="rounded-lg border divide-y">
                  {customers.map((customer) => (
                    <div 
                      key={customer.id}
                      className="flex items-center justify-between p-3 hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => toggleCustomerSelection(customer.id)}
                    >
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.phone} • {customer.orderCount} đơn hàng
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border">
                        {selectedCustomers.includes(customer.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Đã chọn {selectedCustomers.length} khách hàng
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="auto" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="min-orders">Tối thiểu số đơn hàng</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="min-orders-active">Kích hoạt</Label>
                      <Switch id="min-orders-active" defaultChecked />
                    </div>
                  </div>
                  <Input
                    id="min-orders"
                    type="number"
                    value={minOrderCount}
                    onChange={(e) => setMinOrderCount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Khách hàng có số đơn hàng lớn hơn hoặc bằng giá trị này sẽ được thêm vào nhóm
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="min-spend">Tổng giá trị mua hàng (VND)</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="min-spend-active">Kích hoạt</Label>
                      <Switch id="min-spend-active" />
                    </div>
                  </div>
                  <Input
                    id="min-spend"
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Khách hàng có tổng giá trị mua hàng lớn hơn hoặc bằng giá trị này sẽ được thêm vào nhóm
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="customer-tag">Tag khách hàng</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="tag-active">Kích hoạt</Label>
                      <Switch id="tag-active" />
                    </div>
                  </div>
                  <Input
                    id="customer-tag"
                    value={customerTag}
                    onChange={(e) => setCustomerTag(e.target.value)}
                    placeholder="VIP"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Khách hàng có tag trùng với giá trị này sẽ được thêm vào nhóm
                  </p>
                </div>
                
                <div className="py-2 px-3 rounded-lg bg-muted">
                  <p className="text-sm">
                    <strong>5 khách hàng</strong> thỏa mãn điều kiện trên
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
