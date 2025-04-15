
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
import { StockCheckUIItem } from "@/lib/types";

interface StockCheckListProps {
  products: StockCheckUIItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onBarcodeClick: (product: StockCheckUIItem) => void;
  mode: 'list' | 'barcode';
}

export function StockCheckList({
  products,
  onUpdateQuantity,
  mode,
}: StockCheckListProps) {
  if (!products.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có sản phẩm nào cần kiểm kê
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead className="w-[100px] text-center">Hệ thống</TableHead>
            <TableHead className="w-[120px] text-center">Thực tế</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={product.isChecked ? "bg-muted/30" : ""}
            >
              <TableCell>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="font-medium">
                      {product.name}
                      {product.isChecked && (
                        <CheckCircle className="inline-block ml-2 h-4 w-4 text-secondary" />
                      )}
                    </div>
                    {product.commonName && (
                      <div className="text-xs text-muted-foreground">
                        {product.commonName}
                      </div>
                    )}
                    {!product.isChecked && (
                      <Badge
                        variant="outline"
                        className="mt-1 bg-orange-50 text-orange-700 border-orange-200"
                      >
                        Chưa kiểm kê
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {product.expectedQuantity}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={product.actualQuantity || ""}
                  onChange={(e) =>
                    onUpdateQuantity(
                      product.id,
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
