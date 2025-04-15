
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockCheckUIItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface StockCheckScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: StockCheckUIItem | null;
  actualQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onSave: () => void;
}

export function StockCheckScanDialog({
  isOpen,
  onClose,
  product,
  actualQuantity,
  onQuantityChange,
  onSave,
}: StockCheckScanDialogProps) {
  if (!product) return null;

  const difference = actualQuantity - product.expectedQuantity;
  const differenceClass = 
    difference < 0 
      ? "text-red-500" 
      : difference > 0 
        ? "text-green-500" 
        : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name}</DialogTitle>
          {product.commonName && (
            <p className="text-sm text-muted-foreground">{product.commonName}</p>
          )}
          {product.barcode && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {product.barcode}
              </Badge>
            </div>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Số lượng hệ thống</Label>
            <p className="font-medium mt-1 text-lg">{product.expectedQuantity}</p>
          </div>
          <div>
            <Label htmlFor="actualQuantity">Số lượng thực tế</Label>
            <Input
              id="actualQuantity"
              type="number"
              min="0"
              value={actualQuantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
              className="mt-1 text-lg"
              autoFocus
            />
          </div>
          {actualQuantity > 0 && (
            <div>
              <Label>Chênh lệch</Label>
              <p className={`font-medium mt-1 ${differenceClass}`}>
                {difference > 0 ? "+" : ""}
                {difference}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>Lưu sản phẩm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
