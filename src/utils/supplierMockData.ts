
import { Supplier, PurchaseOrder, PurchaseOrderItem } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export const suppliers: Supplier[] = [
  {
    id: "sup-001",
    type: "business",
    businessName: "PharmaVet Co., Ltd",
    ownerName: "Nguyễn Văn An",
    taxCode: "0123456789",
    idNumber: "001122334455",
    phone: "0901234567",
    email: "contact@pharmavets.com",
    address: "123 Nguyễn Huệ, Quận 1, TP. HCM",
    contactPerson: {
      name: "Trần Thị Bình",
      phone: "0908765432",
      email: "binh@pharmavets.com"
    },
    paymentMethod: "bank_transfer",
    tags: ["thuốc", "vaccine"],
    status: "active",
    note: "Nhà cung cấp lớn, ưu tiên đặt hàng",
    createdAt: new Date("2023-05-15"),
    orderCount: 23
  },
  {
    id: "sup-002",
    type: "individual",
    ownerName: "Trần Văn Cường",
    idNumber: "023456789012",
    phone: "0912345678",
    email: "cuong.tran@gmail.com",
    address: "45 Lê Lợi, Quận 5, TP. HCM",
    paymentMethod: "cash",
    tags: ["thức ăn", "phụ kiện"],
    status: "active",
    note: "Cung cấp thức ăn thú cưng cao cấp",
    createdAt: new Date("2023-06-20"),
    orderCount: 12
  },
  {
    id: "sup-003",
    type: "business",
    businessName: "MediPet Supply JSC",
    ownerName: "Lê Thị Dung",
    taxCode: "9876543210",
    idNumber: "098765432109",
    phone: "0976543210",
    email: "info@medipetsupply.com",
    address: "78 Hai Bà Trưng, Quận 3, TP. HCM",
    contactPerson: {
      name: "Phạm Văn Em",
      phone: "0965432109",
      email: "em.pham@medipetsupply.com"
    },
    paymentMethod: "credit",
    tags: ["thuốc", "vitamin", "dụng cụ"],
    status: "inactive",
    note: "Tạm dừng hợp tác do hàng thường xuyên chậm trễ",
    createdAt: new Date("2023-04-10"),
    orderCount: 5
  },
  {
    id: "sup-004",
    type: "business",
    businessName: "VetEquipment Ltd",
    ownerName: "Đỗ Văn Phúc",
    taxCode: "5432167890",
    idNumber: "087654321098",
    phone: "0932109876",
    email: "sales@vetequipment.vn",
    address: "456 Điện Biên Phủ, Quận Bình Thạnh, TP. HCM",
    paymentMethod: "bank_transfer",
    tags: ["thiết bị", "dụng cụ"],
    status: "active",
    note: "",
    createdAt: new Date("2023-07-05"),
    orderCount: 8
  },
  {
    id: "sup-005",
    type: "individual",
    ownerName: "Nguyễn Thị Hồng",
    idNumber: "012987654321",
    phone: "0987612345",
    address: "27 Nguyễn Đình Chiểu, Quận 1, TP. HCM",
    paymentMethod: "cash",
    tags: ["thảo dược", "thuốc"],
    status: "active",
    note: "Cung cấp sản phẩm thảo dược tự nhiên cho thú cưng",
    createdAt: new Date("2023-08-12"),
    orderCount: 3
  }
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    code: "PO-20230615-001",
    supplierId: "sup-001",
    supplierName: "PharmaVet Co., Ltd",
    date: new Date("2023-06-15"),
    items: [
      {
        id: "poi-001",
        productId: "prod-001",
        scientificName: "Amoxicillin 500mg",
        commonName: "Amoxil",
        quantity: 50,
        unitPrice: 5000,
        discount: 5,
        isPercentage: true,
        subTotal: 237500
      },
      {
        id: "poi-002",
        productId: "prod-002",
        scientificName: "Ivermectin 10mg",
        quantity: 30,
        unitPrice: 12000,
        discount: 0,
        isPercentage: false,
        subTotal: 360000
      }
    ],
    subTotal: 597500,
    totalDiscount: 12500,
    total: 585000,
    status: "final",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-15")
  },
  {
    id: "po-002",
    code: "PO-20230720-001",
    supplierId: "sup-002",
    supplierName: "Trần Văn Cường",
    date: new Date("2023-07-20"),
    items: [
      {
        id: "poi-003",
        productId: "prod-003",
        scientificName: "Royal Canin Vet Diet",
        quantity: 15,
        unitPrice: 350000,
        discount: 10,
        isPercentage: true,
        subTotal: 4725000
      }
    ],
    subTotal: 5250000,
    totalDiscount: 525000,
    total: 4725000,
    status: "final",
    createdAt: new Date("2023-07-20"),
    updatedAt: new Date("2023-07-20")
  },
  {
    id: "po-003",
    code: "PO-20230810-001",
    supplierId: "sup-004",
    supplierName: "VetEquipment Ltd",
    date: new Date("2023-08-10"),
    items: [
      {
        id: "poi-004",
        productId: "prod-004",
        scientificName: "Digital Thermometer",
        quantity: 5,
        unitPrice: 450000,
        discount: 0,
        isPercentage: false,
        subTotal: 2250000
      },
      {
        id: "poi-005",
        productId: "prod-005",
        scientificName: "Stethoscope",
        quantity: 2,
        unitPrice: 1200000,
        discount: 200000,
        isPercentage: false,
        subTotal: 2200000
      }
    ],
    subTotal: 4450000,
    totalDiscount: 200000,
    total: 4250000,
    status: "draft",
    note: "Chờ báo giá chính thức",
    createdAt: new Date("2023-08-10"),
    updatedAt: new Date("2023-08-10")
  }
];

export const generatePurchaseOrderCode = () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const randomCode = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `PO-${dateStr}-${randomCode}`;
};
