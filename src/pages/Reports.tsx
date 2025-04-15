
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Package, ClipboardCheck, AlertTriangle } from "lucide-react";

const reports = [
  {
    id: "low-stock",
    title: "Sản phẩm sắp hết hàng",
    description: "Xem danh sách các sản phẩm cần nhập thêm",
    icon: "alert-triangle",
    path: "/low-stock"
  },
  {
    id: "high-stock",
    title: "Sản phẩm tồn kho nhiều",
    description: "Xem danh sách các sản phẩm có số lượng tồn kho cao",
    icon: "package",
    path: "/high-stock"
  },
  {
    id: "stock-history",
    title: "Lịch sử kiểm kê",
    description: "Xem lịch sử các phiên kiểm kê kho",
    icon: "clipboard-check",
    path: "/stock-check/history"
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "alert-triangle":
      return <AlertTriangle className="h-5 w-5" />;
    case "package":
      return <Package className="h-5 w-5" />;
    case "clipboard-check":
      return <ClipboardCheck className="h-5 w-5" />;
    default:
      return <Package className="h-5 w-5" />;
  }
};

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo cáo</h1>
        <p className="text-muted-foreground">Xem các báo cáo về kho hàng</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 p-4">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {getIconComponent(report.icon)}
              </div>
              <div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end p-4 pt-0">
              <Button asChild variant="link" size="sm">
                <Link to={report.path} className="flex items-center gap-1">
                  Xem báo cáo
                  <ChevronRight size={16} />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
