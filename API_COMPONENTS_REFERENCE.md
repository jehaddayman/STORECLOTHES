# Complete API Reference & React Components

## 📡 Full API Endpoints

### Authentication Routes
```javascript
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user profile
POST   /api/auth/refresh-token   - Refresh JWT token
POST   /api/auth/logout          - Logout user
PUT    /api/auth/change-password - Change password
```

### Dashboard Routes
```javascript
GET    /api/dashboard/summary         - Get KPI data
GET    /api/dashboard/charts          - Get chart data
GET    /api/dashboard/top-products    - Top selling products
GET    /api/dashboard/low-stock       - Low stock alerts
GET    /api/dashboard/recent-sales    - Recent transactions
GET    /api/dashboard/expense-summary - Expense breakdown
```

### Product Routes
```javascript
GET    /api/products                      - List all products
POST   /api/products                      - Create product
GET    /api/products/:id                  - Get product details
PUT    /api/products/:id                  - Update product
DELETE /api/products/:id                  - Delete product
GET    /api/products/barcode/:barcode    - Get product by barcode
GET    /api/products/sku/:sku            - Get product by SKU
POST   /api/products/:id/upload-images   - Upload product images
```

### Inventory Routes
```javascript
GET    /api/inventory                     - Get inventory list
POST   /api/inventory/stock-in            - Record stock in
POST   /api/inventory/stock-out           - Record stock out
POST   /api/inventory/adjustment          - Inventory adjustment
POST   /api/inventory/transfer            - Transfer between branches
POST   /api/inventory/damaged             - Record damaged items
POST   /api/inventory/returned            - Record returned items
GET    /api/inventory/history/:productId  - Inventory history
GET    /api/inventory/valuation          - Inventory valuation report
GET    /api/inventory/low-stock          - Low stock items
```

### Sales Routes
```javascript
GET    /api/sales                        - List all sales
POST   /api/sales                        - Create sale/invoice
GET    /api/sales/:id                    - Get invoice details
PUT    /api/sales/:id                    - Update sale
DELETE /api/sales/:id                    - Cancel sale
GET    /api/sales/customer/:customerId   - Get customer sales
POST   /api/sales/:id/print              - Print invoice
GET    /api/sales/:id/download-pdf       - Download PDF
GET    /api/sales/date-range            - Sales by date range
POST   /api/sales/:id/process-payment    - Process payment
```

### Purchase Routes
```javascript
GET    /api/purchases                     - List all purchases
POST   /api/purchases                     - Create purchase order
GET    /api/purchases/:id                 - Get PO details
PUT    /api/purchases/:id                 - Update PO
DELETE /api/purchases/:id                 - Delete PO
GET    /api/purchases/supplier/:supplierId - Supplier purchases
POST   /api/purchases/:id/receive-goods   - Receive goods
POST   /api/purchases/:id/process-payment - Process supplier payment
GET    /api/purchases/date-range         - Purchases by date
```

### Customer Routes
```javascript
GET    /api/customers                     - List all customers
POST   /api/customers                     - Create customer
GET    /api/customers/:id                 - Get customer details
PUT    /api/customers/:id                 - Update customer
DELETE /api/customers/:id                 - Delete customer
GET    /api/customers/:id/sales-history   - Purchase history
GET    /api/customers/:id/ledger          - Customer ledger
GET    /api/customers/:id/balance         - Outstanding balance
POST   /api/customers/:id/payment         - Record payment
GET    /api/customers/search/:term        - Search customers
```

### Supplier Routes
```javascript
GET    /api/suppliers                     - List all suppliers
POST   /api/suppliers                     - Create supplier
GET    /api/suppliers/:id                 - Get supplier details
PUT    /api/suppliers/:id                 - Update supplier
DELETE /api/suppliers/:id                 - Delete supplier
GET    /api/suppliers/:id/purchases       - Supplier purchase history
GET    /api/suppliers/:id/ledger          - Supplier ledger
GET    /api/suppliers/:id/outstanding     - Outstanding dues
POST   /api/suppliers/:id/payment         - Record payment
```

### Expense Routes
```javascript
GET    /api/expenses                      - List all expenses
POST   /api/expenses                      - Create expense
GET    /api/expenses/:id                  - Get expense details
PUT    /api/expenses/:id                  - Update expense
DELETE /api/expenses/:id                  - Delete expense
GET    /api/expenses/category/:category   - Expenses by category
POST   /api/expenses/:id/approve          - Approve expense
GET    /api/expenses/date-range          - Expenses by date
GET    /api/expenses/analytics            - Expense analytics
```

### Accounting Routes
```javascript
GET    /api/accounting/chart-of-accounts       - Get all accounts
POST   /api/accounting/journal-entries         - Create entry
GET    /api/accounting/journal-entries         - List entries
GET    /api/accounting/general-ledger/:account - Get GL account
GET    /api/accounting/trial-balance           - Trial balance
GET    /api/accounting/accounts/:id/balance    - Account balance
POST   /api/accounting/close-period            - Close accounting period
```

### Reports Routes
```javascript
GET    /api/reports/profit-loss           - P&L statement
GET    /api/reports/balance-sheet         - Balance sheet
GET    /api/reports/cash-flow             - Cash flow statement
GET    /api/reports/inventory             - Inventory report
GET    /api/reports/sales                 - Sales report
GET    /api/reports/expenses              - Expense report
GET    /api/reports/vat                   - VAT report
GET    /api/reports/trial-balance         - Trial balance
GET    /api/reports/general-ledger        - General ledger
POST   /api/reports/:type/export-pdf      - Export PDF
POST   /api/reports/:type/export-excel    - Export Excel
```

### Tax Routes
```javascript
GET    /api/tax/settings                  - Get tax settings
PUT    /api/tax/settings                  - Update tax settings
GET    /api/tax/report                    - Tax report
POST   /api/tax/calculate                 - Calculate tax
```

### Branch Routes
```javascript
GET    /api/branches                      - List all branches
POST   /api/branches                      - Create branch
GET    /api/branches/:id                  - Get branch details
PUT    /api/branches/:id                  - Update branch
DELETE /api/branches/:id                  - Delete branch
GET    /api/branches/:id/summary          - Branch summary
GET    /api/branches/:id/inventory        - Branch inventory
```

### Forecast Routes
```javascript
GET    /api/forecast/sales               - Sales forecast
GET    /api/forecast/revenue             - Revenue projection
GET    /api/forecast/top-products        - Top products forecast
GET    /api/forecast/trend-analysis      - Trend analysis
```

---

## 🎨 Key React Components

### Dashboard Components

```javascript
// Dashboard.jsx
export default function Dashboard() {
  // Fetches dashboard summary and charts
  // Displays KPI cards and graphs
}

// DashboardCards.jsx
function DashboardCards({ title, value, icon, color }) {
  // Reusable card component for KPIs
  // Supports icons and color coding
}

// SalesChart.jsx
function SalesChart({ data }) {
  // Line chart showing daily sales
  // Uses Recharts
}

// ExpenseChart.jsx
function ExpenseChart({ data }) {
  // Pie chart showing expense breakdown
  // By category
}

// TopProducts.jsx
function TopProducts() {
  // Table of best-selling products
  // With quantities and revenue
}

// LowStockAlerts.jsx
function LowStockAlerts() {
  // Alert list for inventory below minimum
  // Quick action buttons
}
```

### Product Components

```javascript
// ProductList.jsx
function ProductList() {
  // Searchable, filterable product table
  // Edit/delete buttons
}

// ProductForm.jsx
function ProductForm({ product, onClose }) {
  // Form to create/edit products
  // Image upload
  // SKU/Barcode generation
}

// ProductDetail.jsx
function ProductDetail({ productId }) {
  // Full product information
  // Pricing, inventory, supplier
  // Stock history
}

// BarcodeDisplay.jsx
function BarcodeDisplay({ barcode }) {
  // Display product barcode
  // Print and copy options
}

// ProductSearch.jsx
function ProductSearch() {
  // Real-time product search
  // Quick add to cart
}
```

### Sales Components

```javascript
// POSInterface.jsx
function POSInterface() {
  // POS checkout system
  // Product search and add
  // Discount and tax calculation
  // Payment method selection
}

// CreateInvoice.jsx
function CreateInvoice() {
  // Create sales invoice
  // Multiple products
  // Customer selection
  // Print/download PDF
}

// InvoiceList.jsx
function InvoiceList() {
  // Filterable invoice list
  // Search by invoice number
  // View and reprint options
}

// InvoiceDetail.jsx
function InvoiceDetail({ invoiceId }) {
  // Full invoice view
  // Items breakdown
  // Payment status
  // Action buttons
}

// InvoicePrinter.jsx
function InvoicePrinter({ invoice }) {
  // Print-optimized invoice view
  // Company details
  // Customer info
  // Itemized list
}
```

### Inventory Components

```javascript
// InventoryList.jsx
function InventoryList() {
  // Current stock levels
  // By product and branch
  // Reorder levels shown
}

// StockIn.jsx
function StockIn() {
  // Record incoming inventory
  // Supplier/PO reference
  // Quantity and cost
}

// StockOut.jsx
function StockOut() {
  // Record outgoing inventory
  // Reason selection
  // Sale/damage/return reference
}

// InventoryTransfer.jsx
function InventoryTransfer() {
  // Transfer between branches
  // Multiple items
  // Confirmation process
}

// InventoryReports.jsx
function InventoryReports() {
  // Movement report
  // Dead stock analysis
  // Valuation summary
}
```

### Accounting Components

```javascript
// ChartOfAccounts.jsx
function ChartOfAccounts() {
  // Full account hierarchy
  // Account details
  // Add/edit accounts
}

// JournalEntry.jsx
function JournalEntry() {
  // Create journal entries
  // Balanced debits/credits
  // Account selection
}

// GeneralLedger.jsx
function GeneralLedger() {
  // Account transactions
  // Running balance
  // Date filtering
}

// TrialBalance.jsx
function TrialBalance() {
  // All accounts with balances
  // Debit/credit totals
  // Verify balancing
}

// AccountingDashboard.jsx
function AccountingDashboard() {
  // Accounting overview
  // Recent entries
  // Quick links to reports
}
```

### Report Components

```javascript
// ProfitLoss.jsx
function ProfitLoss() {
  // P&L statement
  // Period selection
  // Export options
}

// BalanceSheet.jsx
function BalanceSheet() {
  // Asset, liability, equity
  // Balance verification
  // Comparative periods
}

// CashFlow.jsx
function CashFlow() {
  // Operating, investing, financing
  // Period analysis
  // Projections
}

// ReportGenerator.jsx
function ReportGenerator() {
  // Select report type
  // Date range
  // Branch filter
  // Export format
}

// ReportViewer.jsx
function ReportViewer({ reportData }) {
  // Display any report
  // Formatting options
  // Print/export buttons
}
```

### Customer Components

```javascript
// CustomerList.jsx
function CustomerList() {
  // All customers
  // Search and filter
  // Edit/delete options
}

// CustomerForm.jsx
function CustomerForm({ customer }) {
  // Create/edit customer
  // Contact details
  // Credit settings
}

// CustomerLedger.jsx
function CustomerLedger({ customerId }) {
  // All transactions
  // Running balance
  // Payment history
}

// CustomerDetail.jsx
function CustomerDetail({ customerId }) {
  // Full customer info
  // Purchase history
  // Outstanding balance
}
```

### Common/UI Components

```javascript
// Button.jsx
function Button({ children, variant, size, ...props }) {
  // Primary, secondary, danger buttons
  // Multiple sizes
  // Loading state
}

// Input.jsx
function Input({ label, error, ...props }) {
  // Text input with validation
  // Label and error display
}

// Modal.jsx
function Modal({ open, onClose, title, children }) {
  // Reusable modal dialog
  // Close button
  // Overlay
}

// Toast.jsx
function Toast({ message, type, duration }) {
  // Success, error, warning toasts
  // Auto-dismiss
}

// Loading.jsx
function Loading() {
  // Loading spinner
  // Various sizes
}

// EmptyState.jsx
function EmptyState({ icon, title, description }) {
  // Empty list state
  // Helpful message
  // Action button
}

// Pagination.jsx
function Pagination({ currentPage, totalPages, onPageChange }) {
  // Page navigation
  // Page size selector
}

// DataTable.jsx
function DataTable({ columns, data, loading, pagination }) {
  // Sortable, filterable table
  // Responsive
  // Row actions
}
```

---

## 🎯 Component Usage Examples

```javascript
// Using Dashboard Cards
<DashboardCards 
  title="Total Revenue"
  value="EGP 50,000"
  icon="TrendingUp"
  color="green"
/>

// Using Product Form
<ProductForm 
  product={null} 
  onClose={() => setShowForm(false)}
/>

// Using DataTable
<DataTable
  columns={[
    { key: 'name', label: 'Product Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price' }
  ]}
  data={products}
  loading={isLoading}
  pagination={{ page: 1, total: 100 }}
/>

// Using Modal
<Modal 
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Product"
>
  <ProductForm onClose={() => setIsOpen(false)} />
</Modal>
```

---

## 🔄 Data Flow

```
User Input → React Component
    ↓
useForm / useState hook
    ↓
Form validation
    ↓
API Service (Axios)
    ↓
Backend Route
    ↓
Middleware (Auth, Validation)
    ↓
Controller
    ↓
Database (MongoDB)
    ↓
Response back to component
    ↓
Update UI / Show toast
```

---

## 🚀 Performance Considerations

1. **Code Splitting**
   - Lazy load route components
   - Dynamic imports for heavy components

2. **Caching**
   - Cache API responses
   - Local storage for non-sensitive data

3. **Database**
   - Index frequently queried fields
   - Use aggregation pipelines
   - Pagination for large datasets

4. **Frontend**
   - Memoize expensive components
   - Virtual scrolling for large lists
   - Image optimization

5. **Backend**
   - Connection pooling
   - Rate limiting
   - Request validation
   - Error handling

