
// Define types
export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  discount: number;
  isPercentage: boolean;
  memberCount: number;
  createdAt: string;
  conditions?: GroupCondition[];
}

export interface GroupCondition {
  type: 'min_orders' | 'min_spend' | 'tag';
  value: number | string;
}

// Mock data for customer groups
export const customerGroups: CustomerGroup[] = [
  {
    id: 'group-1',
    name: 'Khách hàng VIP',
    description: 'Khách hàng mua sắm thường xuyên và chi tiêu nhiều',
    discount: 10,
    isPercentage: true,
    memberCount: 8,
    createdAt: '2023-11-10T08:00:00Z',
    conditions: [
      { type: 'min_spend', value: 5000000 },
      { type: 'min_orders', value: 10 }
    ]
  },
  {
    id: 'group-2',
    name: 'Khách hàng thường xuyên',
    description: 'Khách hàng mua sắm thường xuyên',
    discount: 5,
    isPercentage: true,
    memberCount: 15,
    createdAt: '2023-11-05T08:00:00Z',
    conditions: [
      { type: 'min_orders', value: 5 }
    ]
  },
  {
    id: 'group-3',
    name: 'Khách hàng mới',
    description: 'Khách hàng mới của cửa hàng',
    discount: 50000,
    isPercentage: false,
    memberCount: 23,
    createdAt: '2023-10-28T08:00:00Z'
  }
];

// Mock data for customers
export const customers = [
  {
    id: 'customer-1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    address: 'Hà Nội',
    groupId: 'group-1',
    status: 'active',
    tags: ['VIP', 'Thanh toán tốt'],
    orderCount: 12,
    totalSpent: 8500000,
    createdAt: '2023-09-15T08:00:00Z',
    lastOrderDate: '2023-11-10T08:00:00Z'
  },
  {
    id: 'customer-2',
    name: 'Trần Thị B',
    phone: '0912345678',
    email: 'tranthib@example.com',
    address: 'Hồ Chí Minh',
    groupId: 'group-2',
    status: 'active',
    tags: ['Thanh toán tốt'],
    orderCount: 8,
    totalSpent: 4200000,
    createdAt: '2023-09-20T08:00:00Z',
    lastOrderDate: '2023-11-05T08:00:00Z'
  },
  {
    id: 'customer-3',
    name: 'Lê Văn C',
    phone: '0923456789',
    email: 'levanc@example.com',
    address: 'Đà Nẵng',
    groupId: 'group-3',
    status: 'inactive',
    tags: ['Khách mới'],
    orderCount: 2,
    totalSpent: 800000,
    createdAt: '2023-10-28T08:00:00Z',
    lastOrderDate: '2023-10-30T08:00:00Z'
  },
  {
    id: 'customer-4',
    name: 'Phạm Thị D',
    phone: '0934567890',
    email: 'phamthid@example.com',
    address: 'Cần Thơ',
    status: 'active',
    tags: ['Khách mới'],
    orderCount: 1,
    totalSpent: 500000,
    createdAt: '2023-11-01T08:00:00Z',
    lastOrderDate: '2023-11-01T08:00:00Z'
  },
  {
    id: 'customer-5',
    name: 'Hoàng Văn E',
    phone: '0945678901',
    email: 'hoangvane@example.com',
    address: 'Huế',
    groupId: 'group-1',
    status: 'active',
    tags: ['VIP'],
    orderCount: 15,
    totalSpent: 12500000,
    createdAt: '2023-08-12T08:00:00Z',
    lastOrderDate: '2023-11-12T08:00:00Z'
  }
];
