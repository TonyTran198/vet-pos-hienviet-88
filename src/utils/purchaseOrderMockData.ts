
export const purchaseOrders = [
  {
    id: 'po-001',
    code: 'PO0001',
    supplierId: 'supplier-1',
    createdAt: '2023-04-10T08:00:00Z',
    total: 15000000,
    status: 'completed',
    items: [
      {
        id: 'poi-001',
        productId: 'product-1',
        scientificName: 'Amoxicillin 500mg',
        commonName: 'Amoxicillin',
        quantity: 5,
        unitPrice: 1500000,
        discount: 0,
        isPercentage: false,
        subTotal: 7500000
      },
      {
        id: 'poi-002',
        productId: 'product-2',
        scientificName: 'Doxycycline 100mg',
        commonName: 'Doxycycline',
        quantity: 10,
        unitPrice: 750000,
        discount: 0,
        isPercentage: false,
        subTotal: 7500000
      }
    ]
  },
  {
    id: 'po-002',
    code: 'PO0002',
    supplierId: 'supplier-2',
    createdAt: '2023-04-15T10:30:00Z',
    total: 8500000,
    status: 'draft',
    items: [
      {
        id: 'poi-003',
        productId: 'product-3',
        scientificName: 'Enrofloxacin 50mg',
        commonName: 'Enrofloxacin',
        quantity: 8,
        unitPrice: 850000,
        discount: 0,
        isPercentage: false,
        subTotal: 6800000
      },
      {
        id: 'poi-004',
        productId: 'product-4',
        scientificName: 'Ivermectin 10mg',
        commonName: 'Ivermectin',
        quantity: 2,
        unitPrice: 850000,
        discount: 0,
        isPercentage: false,
        subTotal: 1700000
      }
    ]
  },
  {
    id: 'po-003',
    code: 'PO0003',
    supplierId: 'supplier-1',
    createdAt: '2023-04-20T14:15:00Z',
    total: 12500000,
    status: 'completed',
    items: [
      {
        id: 'poi-005',
        productId: 'product-5',
        scientificName: 'Metronidazole 250mg',
        commonName: 'Metronidazole',
        quantity: 5,
        unitPrice: 1250000,
        discount: 0,
        isPercentage: false,
        subTotal: 6250000
      },
      {
        id: 'poi-006',
        productId: 'product-6',
        scientificName: 'Cephalexin 500mg',
        commonName: 'Cephalexin',
        quantity: 5,
        unitPrice: 1250000,
        discount: 0,
        isPercentage: false,
        subTotal: 6250000
      }
    ]
  }
];
