# Frontend Setup - React Configuration & Key Components

## Frontend package.json

```json
{
  "name": "clothing-erp-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.2",
    "axios": "^1.3.4",
    "zustand": "^4.3.7",
    "@hookform/resolvers": "^3.1.0",
    "react-hook-form": "^7.43.5",
    "recharts": "^2.5.0",
    "chart.js": "^3.9.1",
    "react-chartjs-2": "^4.3.1",
    "date-fns": "^2.29.3",
    "js-cookie": "^3.0.5",
    "react-hot-toast": "^2.4.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-select": "^1.2.1",
    "@radix-ui/react-slot": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^1.2.1",
    "tailwind-merge": "^1.12.0",
    "lucide-react": "^0.263.1",
    "framer-motion": "^10.16.4"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14"
  }
}
```

---

## Vite Config

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

## Tailwind Config

```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## App.jsx - Main Application

```javascript
// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authSlice';
import { useBranchStore } from './store/branchSlice';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import PurchasesPage from './pages/PurchasesPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ExpensesPage from './pages/ExpensesPage';
import AccountingPage from './pages/AccountingPage';
import ReportsPage from './pages/ReportsPage';
import TaxPage from './pages/TaxPage';
import BranchesPage from './pages/BranchesPage';
import ForecastPage from './pages/ForecastPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';

export default function App() {
  const { token, user } = useAuthStore();
  const { branches } = useBranchStore();

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      if (token && user) {
        // Fetch user branches
      }
    };
    initializeApp();
  }, [token]);

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
          <Route path="/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/accounting" element={<ProtectedRoute><AccountingPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/tax" element={<ProtectedRoute><TaxPage /></ProtectedRoute>} />
          <Route path="/branches" element={<ProtectedRoute><BranchesPage /></ProtectedRoute>} />
          <Route path="/forecast" element={<ProtectedRoute><ForecastPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
      <Toaster position="top-right" />
    </Router>
  );
}
```

---

## Auth Store (Zustand)

```javascript
// src/store/authSlice.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) throw new Error('Login failed');

          const data = await response.json();
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isLoading: false
          });

          return data;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: () => set({ user: null, token: null, refreshToken: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);
```

---

## Dashboard Component

```javascript
// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import DashboardCards from './DashboardCards';
import SalesChart from './SalesChart';
import ExpenseChart from './ExpenseChart';
import CashFlowChart from './CashFlowChart';
import TopProducts from './TopProducts';
import LowStockAlerts from './LowStockAlerts';
import RecentTransactions from './RecentTransactions';
import { dashboardService } from '../../services/dashboardService';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardData, chartsData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getCharts()
        ]);

        setData(dashboardData);
        setCharts(chartsData);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCards
          title="Total Revenue"
          value={`EGP ${data?.totalRevenue || 0}`}
          icon="TrendingUp"
          color="green"
        />
        <DashboardCards
          title="Total Expenses"
          value={`EGP ${data?.totalExpenses || 0}`}
          icon="TrendingDown"
          color="red"
        />
        <DashboardCards
          title="Total Profit"
          value={`EGP ${data?.totalProfit || 0}`}
          icon="PieChart"
          color="blue"
        />
        <DashboardCards
          title="Cash Balance"
          value={`EGP ${data?.cashBalance || 0}`}
          icon="Wallet"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={charts?.dailySales} />
        <ExpenseChart data={charts?.expenseBreakdown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CashFlowChart />
        <TopProducts />
        <LowStockAlerts />
      </div>

      <RecentTransactions />
    </div>
  );
}
```

---

## Products Component

```javascript
// src/components/Products/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductForm from './ProductForm';
import BarcodeDisplay from './BarcodeDisplay';
import { useAuthStore } from '../../store/authSlice';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ search, category });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!['admin', 'inventory_manager'].includes(user?.role)) {
      alert('You do not have permission to delete products');
      return;
    }

    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (showForm) {
    return <ProductForm product={selectedProduct} onClose={() => { setShowForm(false); setSelectedProduct(null); fetchProducts(); }} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        {['admin', 'inventory_manager'].includes(user?.role) && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="t_shirts">T-Shirts</option>
          <option value="dresses">Dresses</option>
          <option value="jeans">Jeans</option>
          <option value="jackets">Jackets</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">SKU</th>
                <th className="border p-2 text-left">Barcode</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-right">Cost Price</th>
                <th className="border p-2 text-right">Selling Price</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.sku}</td>
                  <td className="border p-2">
                    <BarcodeDisplay barcode={product.barcode} />
                  </td>
                  <td className="border p-2">{product.category}</td>
                  <td className="border p-2 text-right">{product.costPrice}</td>
                  <td className="border p-2 text-right">{product.sellingPrice}</td>
                  <td className={`border p-2 text-right ${product.quantity < product.minimumStock ? 'bg-red-50' : ''}`}>
                    {product.quantity}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => { setSelectedProduct(product); setShowForm(true); }}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    {['admin', 'inventory_manager'].includes(user?.role) && (
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

## API Service

```javascript
// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(
  config => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Main.jsx

```javascript
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

