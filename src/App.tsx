
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
import StockCheckHistory from "./pages/StockCheckHistory";
import NotFound from "./pages/NotFound";

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
          <Route path="/stock-check" element={<StockCheck />} />
          <Route path="/stock-check/history" element={<StockCheckHistory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/low-stock" element={<LowStockList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
