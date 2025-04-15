
import { useState } from "react";
import { Link } from "react-router-dom";
import { products, categories } from "@/utils/mockData";
import { ProductItem } from "@/components/ProductItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Plus, Search } from "lucide-react";

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredProducts = products.filter((product) => {
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
    
    return matchesSearch && matchesCategory;
  });
  
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
      
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mã vạch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
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
      </div>
      
      <div className="space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
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
