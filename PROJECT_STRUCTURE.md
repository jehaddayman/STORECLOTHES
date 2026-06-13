# Enterprise ERP System - Project Structure

```
clothing-erp/
│
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Customer.js
│   │   ├── Supplier.js
│   │   ├── Sales.js
│   │   ├── Purchase.js
│   │   ├── Inventory.js
│   │   ├── Expense.js
│   │   ├── Branch.js
│   │   ├── JournalEntry.js
│   │   └── Tax.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── products.js
│   │   ├── inventory.js
│   │   ├── sales.js
│   │   ├── purchases.js
│   │   ├── customers.js
│   │   ├── suppliers.js
│   │   ├── expenses.js
│   │   ├── accounting.js
│   │   ├── reports.js
│   │   ├── branches.js
│   │   └── forecast.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── productController.js
│   │   ├── inventoryController.js
│   │   ├── salesController.js
│   │   ├── purchaseController.js
│   │   ├── customerController.js
│   │   ├── supplierController.js
│   │   ├── expenseController.js
│   │   ├── accountingController.js
│   │   ├── reportController.js
│   │   ├── branchController.js
│   │   └── forecastController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   │
│   ├── utils/
│   │   ├── barcodeGenerator.js
│   │   ├── journalEntry.js
│   │   ├── reportGenerator.js
│   │   ├── forecastEngine.js
│   │   └── emailService.js
│   │
│   ├── scripts/
│   │   └── seedData.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardCards.jsx
│   │   │   │   ├── SalesChart.jsx
│   │   │   │   ├── ExpenseChart.jsx
│   │   │   │   ├── RevenueChart.jsx
│   │   │   │   ├── CashFlowChart.jsx
│   │   │   │   ├── TopProducts.jsx
│   │   │   │   ├── LowStockAlerts.jsx
│   │   │   │   ├── RecentTransactions.jsx
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   ├── Products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── BarcodeDisplay.jsx
│   │   │   │   └── ProductSearch.jsx
│   │   │   │
│   │   │   ├── Inventory/
│   │   │   │   ├── InventoryList.jsx
│   │   │   │   ├── StockIn.jsx
│   │   │   │   ├── StockOut.jsx
│   │   │   │   ├── InventoryTransfer.jsx
│   │   │   │   ├── DamagedItems.jsx
│   │   │   │   ├── ReturnedItems.jsx
│   │   │   │   └── InventoryReports.jsx
│   │   │   │
│   │   │   ├── Sales/
│   │   │   │   ├── POSInterface.jsx
│   │   │   │   ├── CreateInvoice.jsx
│   │   │   │   ├── InvoiceList.jsx
│   │   │   │   ├── InvoiceDetail.jsx
│   │   │   │   ├── PaymentMethods.jsx
│   │   │   │   └── InvoicePrinter.jsx
│   │   │   │
│   │   │   ├── Customers/
│   │   │   │   ├── CustomerList.jsx
│   │   │   │   ├── CustomerForm.jsx
│   │   │   │   ├── CustomerLedger.jsx
│   │   │   │   └── CustomerDetail.jsx
│   │   │   │
│   │   │   ├── Suppliers/
│   │   │   │   ├── SupplierList.jsx
│   │   │   │   ├── SupplierForm.jsx
│   │   │   │   ├── SupplierLedger.jsx
│   │   │   │   └── PurchaseOrders.jsx
│   │   │   │
│   │   │   ├── Purchases/
│   │   │   │   ├── PurchaseOrderList.jsx
│   │   │   │   ├── CreatePurchaseOrder.jsx
│   │   │   │   ├── ReceiveInventory.jsx
│   │   │   │   └── SupplierBilling.jsx
│   │   │   │
│   │   │   ├── Expenses/
│   │   │   │   ├── ExpenseList.jsx
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   └── ExpenseAnalytics.jsx
│   │   │   │
│   │   │   ├── Accounting/
│   │   │   │   ├── ChartOfAccounts.jsx
│   │   │   │   ├── JournalEntry.jsx
│   │   │   │   ├── GeneralLedger.jsx
│   │   │   │   ├── TrialBalance.jsx
│   │   │   │   └── AccountingDashboard.jsx
│   │   │   │
│   │   │   ├── Reports/
│   │   │   │   ├── ProfitLoss.jsx
│   │   │   │   ├── BalanceSheet.jsx
│   │   │   │   ├── CashFlow.jsx
│   │   │   │   ├── SalesReport.jsx
│   │   │   │   ├── InventoryReport.jsx
│   │   │   │   ├── VATReport.jsx
│   │   │   │   └── ReportGenerator.jsx
│   │   │   │
│   │   │   ├── Tax/
│   │   │   │   ├── TaxSettings.jsx
│   │   │   │   └── TaxManagement.jsx
│   │   │   │
│   │   │   ├── Branches/
│   │   │   │   ├── BranchList.jsx
│   │   │   │   ├── BranchForm.jsx
│   │   │   │   └── BranchSelector.jsx
│   │   │   │
│   │   │   ├── Forecast/
│   │   │   │   ├── ForecastDashboard.jsx
│   │   │   │   ├── SalesForecast.jsx
│   │   │   │   └── RevenueProjection.jsx
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   │
│   │   │   ├── Common/
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   │
│   │   │   └── UI/
│   │   │       └── [...shadcn components]
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── SalesPage.jsx
│   │   │   ├── PurchasesPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── SuppliersPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── AccountingPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── TaxPage.jsx
│   │   │   ├── BranchesPage.jsx
│   │   │   ├── ForecastPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   ├── useForm.js
│   │   │   └── useNotification.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── salesService.js
│   │   │   ├── purchaseService.js
│   │   │   ├── reportService.js
│   │   │   └── dashboardService.js
│   │   │
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── branchSlice.js
│   │   │   ├── themeSlice.js
│   │   │   └── store.js (Redux)
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   ├── constants.js
│   │   │   └── localStorage.js
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── tailwind.css
│   │   │   └── animations.css
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── vite-env.d.ts
│   │
│   ├── public/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   │
│   ├── .env
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── index.html
│
├── README.md
├── DEPLOYMENT.md
└── .gitignore
```

## Project Features

### ✅ Core Functionality
- **Multi-role RBAC**: Admin, Accountant, Sales Employee, Inventory Manager
- **Double-entry Accounting**: Full GL, AP, AR, Chart of Accounts
- **Inventory Management**: Stock in/out, transfers, damaged items, valuations
- **POS System**: Multi-product invoices with discounts, taxes, multiple payment methods
- **Financial Reports**: P&L, Balance Sheet, Cash Flow, Trial Balance, VAT reports
- **Multi-branch Support**: Separate inventory and financial tracking per branch
- **AI Forecasting**: Sales predictions based on historical data
- **Barcode System**: Auto-generation and scanning capabilities
- **Real-time Notifications**: Low stock, sales, purchases, overdue payments

### 🎨 Frontend
- Dark/Light mode
- Responsive design
- Modern Shadcn UI
- Interactive charts (Recharts)
- Real-time notifications
- Advanced search & filtering

### 🔒 Security
- JWT authentication with refresh tokens
- Role-based access control
- Input validation
- Error handling

### 📊 Demo Data
- 100 Products with images
- 50 Customers
- 20 Suppliers
- 500+ Sales transactions
- 200+ Purchases
- 300+ Expenses

### 🚀 Deployment
- Railway.app ready
- MongoDB Atlas
- Environment configuration
- Auto-scaling setup
