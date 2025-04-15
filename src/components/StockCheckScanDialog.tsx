
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockCheckUIItem } from "@/lib/types";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Số lượng hệ thống</Label>
            <p className="font-medium mt-1">{product.expectedQuantity}</p>
          </div>
          <div>
            <Label htmlFor="actualQuantity">Số lượng thực tế</Label>
            <Input
              id="actualQuantity"
              type="number"
              min="0"
              value={actualQuantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>Lưu sản phẩm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
