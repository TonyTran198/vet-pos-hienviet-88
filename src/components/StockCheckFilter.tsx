
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Category } from "@/lib/types";

interface StockCheckFilterProps {
  categories: Category[];
  onFilterChange: (filters: {
    category: string;
    keyword: string;
    status: string;
  }) => void;
}

export function StockCheckFilter({ categories, onFilterChange }: StockCheckFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");

  const handleApplyFilters = () => {
    onFilterChange({
      category: selectedCategory,
      keyword: keyword,
      status: status,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setKeyword("");
    setStatus("all");
    onFilterChange({
      category: "all",
      keyword: "",
      status: "all",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên sản phẩm, barcode..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (!e.target.value) {
                onFilterChange({
                  category: selectedCategory,
                  keyword: "",
                  status: status,
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
            className="pl-9 pr-12"
          />
          <Button
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="rounded-md border p-3 space-y-3 bg-background shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="category" className="text-xs font-medium">
                Danh mục sản phẩm
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label htmlFor="status" className="text-xs font-medium">
                Trạng thái kiểm kê
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="unchecked">Chưa kiểm kê</SelectItem>
                  <SelectItem value="checked">Đã kiểm kê</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
