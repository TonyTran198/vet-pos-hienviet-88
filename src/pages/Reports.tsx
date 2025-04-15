
import { useState } from "react";
import { Link } from "react-router-dom";
import { reports } from "@/utils/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { AlertTriangle, Package, BarChart2, Clipboard } from "lucide-react";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "alert-triangle":
      return <AlertTriangle className="h-5 w-5" />;
    case "package":
      return <Package className="h-5 w-5" />;
    case "bar-chart":
      return <BarChart2 className="h-5 w-5" />;
    case "clipboard-check":
      return <Clipboard className="h-5 w-5" />;
    default:
      return <BarChart2 className="h-5 w-5" />;
  }
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState("all");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo cáo</h1>
        <p className="text-muted-foreground">Xem các báo cáo về kho hàng</p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="sales">Doanh số</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
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
                    <Link
                      to={report.id === "report1" ? "/low-stock" : `/reports/${report.id}`}
                      className="flex items-center gap-1"
                    >
                      Xem báo cáo
                      <ChevronRight size={16} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {reports
              .filter((report) => report.id === "report1" || report.id === "report2")
              .map((report) => (
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
                      <Link
                        to={report.id === "report1" ? "/low-stock" : `/reports/${report.id}`}
                        className="flex items-center gap-1"
                      >
                        Xem báo cáo
                        <ChevronRight size={16} />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {reports
              .filter((report) => report.id === "report3")
              .map((report) => (
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
                      <Link to={`/reports/${report.id}`} className="flex items-center gap-1">
                        Xem báo cáo
                        <ChevronRight size={16} />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
