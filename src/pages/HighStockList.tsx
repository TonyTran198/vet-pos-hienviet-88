
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/utils/mockData";

export default function HighStockList() {
  const navigate = useNavigate();
  
  // Sort products by quantity in descending order and take top items
  const highStockProducts = products
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 20);  // Show top 20 items with highest stock

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/reports")}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm tồn kho nhiều</h1>
          <p className="text-muted-foreground">
            Danh sách các sản phẩm có số lượng tồn kho cao
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead className="text-right">Số lượng tồn kho</TableHead>
              <TableHead>Đơn vị tính</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {highStockProducts.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
