
import { Customer, CustomerGroup } from "@/lib/types";

export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "Nguyễn Văn Anh",
    phone: "0901234567",
    email: "anh.nguyen@gmail.com",
    address: "123 Nguyễn Huệ, Quận 1, TP. HCM",
    discount: 10,
    isPercentage: true,
    tags: ["VIP", "thường xuyên"],
    groupId: "group-001",
    note: "Khách hàng thân thiết",
    createdAt: new Date("2023-01-15"),
    orderCount: 25,
    status: "active"
  },
  {
    id: "cust-002",
    name: "Trần Thị Bình",
    phone: "0912345678",
    address: "45 Lê Lợi, Quận 5, TP. HCM",
    discount: 5,
    isPercentage: true,
    tags: ["thường xuyên"],
    groupId: "group-002",
    createdAt: new Date("2023-02-20"),
    orderCount: 12,
    status: "active"
  },
  {
    id: "cust-003",
    name: "Lê Văn Cường",
    phone: "0978654321",
    email: "cuong.le@gmail.com",
    discount: 50000,
    isPercentage: false,
    tags: ["mới"],
    createdAt: new Date("2023-06-10"),
    orderCount: 2,
    status: "active"
  },
  {
    id: "cust-004",
    name: "Phạm Thị Dung",
    phone: "0987612345",
    address: "27 Nguyễn Đình Chiểu, Quận 1, TP. HCM",
    tags: ["VIP"],
    groupId: "group-001",
    createdAt: new Date("2023-03-05"),
    orderCount: 18,
    status: "active"
  },
  {
    id: "cust-005",
    name: "Hoàng Văn Em",
    phone: "0932109876",
    email: "em.hoang@gmail.com",
    tags: [],
    note: "Khách hàng không còn hoạt động",
    createdAt: new Date("2022-11-12"),
    orderCount: 3,
    status: "inactive"
  }
];

export const customerGroups: CustomerGroup[] = [
  {
    id: "group-001",
    name: "Khách hàng VIP",
    description: "Khách hàng cao cấp, được ưu đãi đặc biệt",
    discount: 10,
    isPercentage: true,
    customerCount: 8,
    conditions: [
      {
        id: "cond-001",
        type: "min_orders",
        value: 15
      },
      {
        id: "cond-002",
        type: "tag",
        value: "VIP"
      }
    ],
    createdAt: new Date("2022-12-15")
  },
  {
    id: "group-002",
    name: "Khách thường xuyên",
    description: "Khách hàng mua sắm thường xuyên",
    discount: 5,
    isPercentage: true,
    customerCount: 15,
    conditions: [
      {
        id: "cond-003",
        type: "min_orders",
        value: 5
      }
    ],
    createdAt: new Date("2023-01-10")
  },
  {
    id: "group-003",
    name: "Khách mua số lượng lớn",
    description: "Khách hàng mua với số lượng lớn",
    discount: 7,
    isPercentage: true,
    customerCount: 3,
    conditions: [
      {
        id: "cond-004",
        type: "min_spend",
        value: 10000000
      }
    ],
    createdAt: new Date("2023-03-22")
  }
];
