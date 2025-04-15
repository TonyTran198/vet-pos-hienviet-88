
import { Product, Category, StockCheck, Report } from "../lib/types";

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Thuốc kháng sinh",
    description: "Các loại thuốc kháng sinh",
    productCount: 15
  },
  {
    id: "cat2",
    name: "Thuốc giảm đau",
    description: "Các loại thuốc giảm đau",
    productCount: 8
  },
  {
    id: "cat3",
    name: "Vitamin & khoáng chất",
    description: "Các loại vitamin và khoáng chất bổ sung",
    productCount: 12
  },
  {
    id: "cat4",
    name: "Thuốc ngoài da",
    description: "Các loại thuốc bôi ngoài da",
    productCount: 10
  }
];

export const products: Product[] = [
  {
    id: "prod1",
    scientificName: "Amoxicillin 250mg",
    commonName: "Amoxicillin",
    categoryId: "cat1",
    barcode: "8935001730025",
    sku: "AMOX-250",
    unit: "Viên",
    tags: ["kháng sinh", "phổ rộng"],
    description: "Thuốc kháng sinh điều trị nhiễm trùng",
    quantity: 120,
    costPrice: 2000,
    sellingPrice: 3500,
    uses: "Điều trị nhiễm trùng đường hô hấp, tiêu hóa",
    ingredients: "Amoxicillin trihydrate tương đương 250mg amoxicillin",
    status: "active",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-02-10"),
    notes: "Sản phẩm bán chạy"
  },
  {
    id: "prod2",
    scientificName: "Enrofloxacin 50mg",
    commonName: "Enrofloxacin",
    categoryId: "cat1",
    barcode: "8935001730032",
    sku: "ENRO-50",
    unit: "Viên",
    tags: ["kháng sinh", "quinolone"],
    description: "Kháng sinh phổ rộng nhóm quinolone",
    quantity: 5,
    costPrice: 5000,
    sellingPrice: 8000,
    uses: "Điều trị nhiễm trùng do vi khuẩn nhạy cảm",
    ingredients: "Enrofloxacin 50mg",
    status: "active",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-04-05"),
    notes: "Hàng sắp hết"
  },
  {
    id: "prod3",
    scientificName: "Meloxicam 1.5mg",
    commonName: "Meloxicam",
    categoryId: "cat2",
    barcode: "8935001730049",
    sku: "MELO-15",
    unit: "Viên",
    tags: ["giảm đau", "NSAID"],
    description: "Thuốc kháng viêm không steroid",
    quantity: 80,
    costPrice: 3000,
    sellingPrice: 5000,
    uses: "Giảm đau, kháng viêm",
    ingredients: "Meloxicam 1.5mg",
    status: "active",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-03-15"),
    notes: ""
  },
  {
    id: "prod4",
    scientificName: "Vitamin B Complex",
    commonName: "B Complex",
    categoryId: "cat3",
    barcode: "8935001730056",
    sku: "VITB-01",
    unit: "Lọ",
    tags: ["vitamin", "bổ sung"],
    description: "Hỗn hợp vitamin nhóm B",
    quantity: 45,
    costPrice: 40000,
    sellingPrice: 65000,
    uses: "Bổ sung vitamin nhóm B",
    ingredients: "Vitamin B1, B2, B6, B12",
    status: "active",
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-02-20"),
    notes: ""
  },
  {
    id: "prod5",
    scientificName: "Miconazole Cream 2%",
    commonName: "Miconazole",
    categoryId: "cat4",
    barcode: "8935001730063",
    sku: "MICO-02",
    unit: "Tuýp",
    tags: ["nấm da", "ngoài da"],
    description: "Kem bôi kháng nấm",
    quantity: 3,
    costPrice: 35000,
    sellingPrice: 55000,
    uses: "Điều trị bệnh nấm ngoài da",
    ingredients: "Miconazole nitrate 2%",
    status: "active",
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
    notes: "Cần nhập thêm hàng gấp"
  }
];

export const stockChecks: StockCheck[] = [
  {
    id: "check1",
    date: new Date("2023-04-01"),
    products: [
      {
        productId: "prod1",
        productName: "Amoxicillin 250mg",
        expectedQuantity: 150,
        actualQuantity: 120,
        difference: -30
      },
      {
        productId: "prod2",
        productName: "Enrofloxacin 50mg",
        expectedQuantity: 20,
        actualQuantity: 15,
        difference: -5
      }
    ],
    notes: "Kiểm kê quý 1/2023"
  },
  {
    id: "check2",
    date: new Date("2023-03-01"),
    products: [
      {
        productId: "prod3",
        productName: "Meloxicam 1.5mg",
        expectedQuantity: 100,
        actualQuantity: 95,
        difference: -5
      },
      {
        productId: "prod4",
        productName: "Vitamin B Complex",
        expectedQuantity: 50,
        actualQuantity: 50,
        difference: 0
      }
    ],
    notes: "Kiểm kê tháng 3/2023"
  }
];

export const reports: Report[] = [
  {
    id: "report1",
    title: "Sản phẩm sắp hết hàng",
    description: "Danh sách sản phẩm có số lượng tồn kho thấp",
    icon: "alert-triangle"
  },
  {
    id: "report2",
    title: "Sản phẩm tồn kho nhiều",
    description: "Danh sách sản phẩm có số lượng tồn kho cao",
    icon: "package"
  },
  {
    id: "report3",
    title: "Báo cáo doanh số",
    description: "Thống kê doanh số bán hàng theo thời gian",
    icon: "bar-chart"
  },
  {
    id: "report4",
    title: "Lịch sử kiểm kê",
    description: "Xem lịch sử các đợt kiểm kê kho",
    icon: "clipboard-check"
  }
];

export function getLowStockProducts(threshold = 10): Product[] {
  return products.filter(product => product.quantity <= threshold);
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}
