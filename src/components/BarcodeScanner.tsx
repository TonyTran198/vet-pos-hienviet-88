
import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isOpen && !readerRef.current) {
      readerRef.current = new BrowserMultiFormatReader();
      
      if (videoRef.current) {
        readerRef.current
          .decodeFromConstraints(
            {
              audio: false,
              video: { facingMode: "environment" }
            },
            videoRef.current,
            (result, error) => {
              if (result) {
                onScan(result.getText());
                onClose();
              }
            }
          )
          .catch(error => {
            console.error("Error accessing camera:", error);
          });
      }
    }

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
        readerRef.current = null;
      }
    };
  }, [isOpen, onClose, onScan]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-[4/3] object-cover rounded-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
