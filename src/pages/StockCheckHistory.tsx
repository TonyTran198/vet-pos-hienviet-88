
import { useState } from "react";
import { stockChecks } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function StockCheckHistory() {
  const navigate = useNavigate();
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  const toggleExpand = (id: string) => {
    if (expandedCheckId === id) {
      setExpandedCheckId(null);
    } else {
      setExpandedCheckId(id);
    }
  };
  
  // Filter checks if search query exists
  const filteredChecks = searchQuery
    ? stockChecks.filter((check) =>
        check.products.some((product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        check.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(check.date).includes(searchQuery)
      )
    : stockChecks;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Lịch sử kiểm kê</h1>
          <p className="text-muted-foreground">Xem các phiên kiểm kê trước đây</p>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm phiên kiểm kê..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="space-y-4">
        {filteredChecks.length > 0 ? (
          filteredChecks.map((check) => (
            <Card key={check.id} className="overflow-hidden">
              <CardHeader
                className="flex cursor-pointer flex-row items-center justify-between p-4"
                onClick={() => toggleExpand(check.id)}
              >
                <div>
                  <CardTitle className="text-base font-medium">
                    Kiểm kê ngày {formatDate(check.date)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {check.products.length} sản phẩm
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {check.products.some((p) => p.difference !== 0) && (
                    <Badge variant="outline" className="text-warning">
                      Có chênh lệch
                    </Badge>
                  )}
                  {expandedCheckId === check.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </CardHeader>
              
              {expandedCheckId === check.id && (
                <CardContent className="px-4 pb-4">
                  <Separator className="mb-4" />
                  
                  {check.notes && (
                    <div className="mb-4 rounded-md bg-muted p-3">
                      <p className="text-sm font-medium">Ghi chú:</p>
                      <p className="text-sm">{check.notes}</p>
                    </div>
                  )}
                  
                  <p className="mb-2 text-sm font-medium">Danh sách sản phẩm kiểm kê:</p>
                  
                  <div className="space-y-3">
                    {check.products.map((product) => (
                      <div
                        key={product.productId}
                        className="rounded-md border p-3"
                      >
                        <p className="font-medium">{product.productName}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Hệ thống</p>
                            <p>{product.expectedQuantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Thực tế</p>
                            <p>{product.actualQuantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Chênh lệch</p>
                            <p
                              className={
                                product.difference > 0
                                  ? "text-secondary"
                                  : product.difference < 0
                                  ? "text-destructive"
                                  : ""
                              }
                            >
                              {product.difference > 0 ? "+" : ""}
                              {product.difference}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Không tìm thấy phiên kiểm kê nào
          </p>
        )}
      </div>
    </div>
  );
}
