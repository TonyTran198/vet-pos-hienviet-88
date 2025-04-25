
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import StockCheck from "./pages/StockCheck";
import Reports from "./pages/Reports";
import LowStockList from "./pages/LowStockList";
import HighStockList from "./pages/HighStockList";
import StockCheckHistory from "./pages/StockCheckHistory";
import NotFound from "./pages/NotFound";
// Supplier routes
import SupplierList from "./pages/supplier/SupplierList";
import AddSupplier from "./pages/supplier/AddSupplier";
import SupplierDetail from "./pages/supplier/SupplierDetail";
import EditSupplier from "./pages/supplier/EditSupplier";
// Purchase order routes
import PurchaseOrderList from "./pages/purchase/PurchaseOrderList";
import CreatePurchaseOrder from "./pages/purchase/CreatePurchaseOrder";
import PurchaseOrderDetail from "./pages/purchase/PurchaseOrderDetail";
// Customer routes
import CustomerList from "./pages/customer/CustomerList";
import AddCustomer from "./pages/customer/AddCustomer";
import CustomerDetail from "./pages/customer/CustomerDetail";
import EditCustomer from "./pages/customer/EditCustomer";
// Customer group routes
import CustomerGroupList from "./pages/customer/CustomerGroupList";
import AddCustomerGroup from "./pages/customer/AddCustomerGroup";
import EditCustomerGroup from "./pages/customer/EditCustomerGroup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/products/edit/:productId" element={<AddProduct />} />
          <Route path="/stock-check" element={<StockCheck />} />
          <Route path="/stock-check/history" element={<StockCheckHistory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/low-stock" element={<LowStockList />} />
          <Route path="/high-stock" element={<HighStockList />} />
          
          {/* Supplier Management Routes */}
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetail />} />
          <Route path="/suppliers/edit/:supplierId" element={<EditSupplier />} />
          
          {/* Purchase Order Routes */}
          <Route path="/purchase-orders" element={<PurchaseOrderList />} />
          <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />
          <Route path="/purchase-orders/:orderId" element={<PurchaseOrderDetail />} />
          
          {/* Customer Management Routes */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/:customerId" element={<CustomerDetail />} />
          <Route path="/customers/edit/:customerId" element={<EditCustomer />} />
          
          {/* Customer Group Routes */}
          <Route path="/customer-groups" element={<CustomerGroupList />} />
          <Route path="/customer-groups/add" element={<AddCustomerGroup />} />
          <Route path="/customer-groups/edit/:groupId" element={<EditCustomerGroup />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
