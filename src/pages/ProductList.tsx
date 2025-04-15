
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, categories } from "@/utils/mockData";
import { ProductItem } from "@/components/ProductItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Filter, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ScanBarcode,
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Product } from "@/lib/types";

export default function ProductList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("nameAsc");
  
  // Additional filters
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [stockRange, setStockRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Get unique tags from all products
  const allTags = Array.from(
    new Set(products.flatMap((product) => product.tags))
  );
  
  // Get min and max prices for range slider
  const minPrice = Math.min(...products.map((product) => product.sellingPrice));
  const maxPrice = Math.max(...products.map((product) => product.sellingPrice));
  
  // Get min and max stock levels for range slider
  const minStock = Math.min(...products.map((product) => product.quantity));
  const maxStock = Math.max(...products.map((product) => product.quantity));
  
  // Set initial price and stock ranges based on actual data
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    setStockRange([minStock, maxStock]);
  }, [minPrice, maxPrice, minStock, maxStock]);
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) 
        ? prev.filter((t) => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleBarcodeScanner = () => {
    // In a real app, this would trigger a barcode scanner
    toast.info("Tính năng quét mã vạch sẽ sớm được triển khai");
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };
  
  // Apply all filters and sorting
  const filteredAndSortedProducts = products
    .filter((product) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        product.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.includes(searchQuery);
      
      // Filter by category
      const matchesCategory = 
        selectedCategory === "all" || 
        product.categoryId === selectedCategory;
        
      // Filter by price range
      const matchesPrice = 
        product.sellingPrice >= priceRange[0] && 
        product.sellingPrice <= priceRange[1];
        
      // Filter by stock range
      const matchesStock = 
        product.quantity >= stockRange[0] && 
        product.quantity <= stockRange[1];
        
      // Filter by tags
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.some(tag => product.tags.includes(tag));
        
      // Filter by status
      const matchesStatus = 
        selectedStatus === "all" || 
        product.status === selectedStatus;
        
      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesTags && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case "nameAsc":
          return a.scientificName.localeCompare(b.scientificName);
        case "nameDesc":
          return b.scientificName.localeCompare(a.scientificName);
        case "priceAsc":
          return a.sellingPrice - b.sellingPrice;
        case "priceDesc":
          return b.sellingPrice - a.sellingPrice;
        case "stockAsc":
          return a.quantity - b.quantity;
        case "stockDesc":
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });
  
  // Format price for display
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý tất cả sản phẩm</p>
        </div>
        <Button asChild>
          <Link to="/products/add">
            <Plus size={18} className="mr-2" />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mã vạch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1"
            onClick={handleBarcodeScanner}
          >
            <ScanBarcode className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            Bộ lọc
            {isFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown size={18} />
                Sắp xếp
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOption("nameAsc")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Tên (A → Z)
                {sortOption === "nameAsc" && <Badge className="ml-2">Đang chọn</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("nameDesc")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Tên (Z → A)
                {sortOption === "nameDesc" && <Badge className="ml-2">Đang chọn</Badge>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOption("priceAsc")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Giá: Thấp → Cao
                {sortOption === "priceAsc" && <Badge className="ml-2">Đang chọn</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("priceDesc")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Giá: Cao → Thấp
                {sortOption === "priceDesc" && <Badge className="ml-2">Đang chọn</Badge>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOption("stockAsc")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Tồn kho: Ít → Nhiều
                {sortOption === "stockAsc" && <Badge className="ml-2">Đang chọn</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("stockDesc")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Tồn kho: Nhiều → Ít
                {sortOption === "stockDesc" && <Badge className="ml-2">Đang chọn</Badge>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleContent className="space-y-4 rounded-md border p-4">
            {/* Category filter */}
            <div className="space-y-2">
              <Label>Danh mục sản phẩm</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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
            
            {/* Price range filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Khoảng giá</Label>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(priceRange[0])}đ - {formatPrice(priceRange[1])}đ
                </p>
              </div>
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
            </div>
            
            {/* Stock range filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tồn kho</Label>
                <p className="text-sm text-muted-foreground">
                  {stockRange[0]} - {stockRange[1]} sản phẩm
                </p>
              </div>
              <Slider
                defaultValue={[minStock, maxStock]}
                min={minStock}
                max={maxStock}
                step={1}
                value={stockRange}
                onValueChange={setStockRange}
              />
            </div>
            
            {/* Status filter */}
            <div className="space-y-2">
              <Label>Trạng thái sản phẩm</Label>
              <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Tất cả</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Còn bán</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive">Ngừng bán</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Tags filter */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Reset filters button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange([minPrice, maxPrice]);
                setStockRange([minStock, maxStock]);
                setSelectedTags([]);
                setSelectedStatus("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="space-y-3">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
            <div 
              key={product.id} 
              className="cursor-pointer" 
              onClick={() => handleProductClick(product.id)}
            >
              <ProductItem product={product} />
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Không tìm thấy sản phẩm nào
          </p>
        )}
      </div>
    </div>
  );
}
