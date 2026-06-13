# Utility Functions & Helper Modules

## Barcode Generator

```javascript
// backend/utils/barcodeGenerator.js
import JsBarcode from 'jsbarcode';
import canvas from 'canvas';
import fs from 'fs';
import path from 'path';

export async function generateBarcode(sku) {
  try {
    const canvasElement = canvas.createCanvas(200, 50);
    
    JsBarcode(canvasElement, sku, {
      format: 'CODE128',
      width: 2,
      height: 50,
      displayValue: true
    });

    const barcodePath = path.join(process.cwd(), 'barcodes', `${sku}.png`);
    
    // Create barcodes directory if it doesn't exist
    if (!fs.existsSync(path.dirname(barcodePath))) {
      fs.mkdirSync(path.dirname(barcodePath), { recursive: true });
    }

    const buffer = canvasElement.toBuffer('image/png');
    fs.writeFileSync(barcodePath, buffer);

    return sku; // Return SKU as barcode identifier
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
}
```

---

## Journal Entry Generator

```javascript
// backend/utils/journalEntry.js
import JournalEntry from '../models/JournalEntry.js';

export async function createJournalEntry(data) {
  try {
    const {
      description,
      items,
      reference,
      status = 'posted'
    } = data;

    let totalDebit = 0;
    let totalCredit = 0;

    const lines = items.map(item => {
      totalDebit += item.debit || 0;
      totalCredit += item.credit || 0;
      return {
        accountCode: item.account,
        accountName: getAccountName(item.account),
        debit: item.debit || 0,
        credit: item.credit || 0
      };
    });

    // Validate double-entry
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error('Debits and credits do not balance');
    }

    const journalNumber = await generateJournalNumber();

    const entry = new JournalEntry({
      journalNumber,
      description,
      lines,
      totalDebit,
      totalCredit,
      reference,
      status
    });

    await entry.save();
    return entry;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
}

export async function generateJournalNumber() {
  const lastEntry = await JournalEntry.findOne().sort({ createdAt: -1 });
  const lastNumber = lastEntry ? parseInt(lastEntry.journalNumber.split('-')[1]) : 0;
  return `JE-${String(lastNumber + 1).padStart(6, '0')}`;
}

export function getAccountName(accountCode) {
  const accounts = {
    '1010': 'Cash',
    '1020': 'Bank',
    '1030': 'Accounts Receivable',
    '1040': 'Inventory',
    '2010': 'Accounts Payable',
    '3010': 'Owner Capital',
    '4010': 'Sales Revenue',
    '5010': 'Cost of Goods Sold',
    '6010': 'Rent Expense',
    '6020': 'Salaries Expense',
    '6030': 'Utilities Expense',
    '2110': 'VAT Payable'
  };
  return accounts[accountCode] || 'Unknown Account';
}
```

---

## Report Generator

```javascript
// backend/utils/reportGenerator.js
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateProfitLossReport(startDate, endDate, branchId) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('P&L Statement');

  // Add headers
  worksheet.columns = [
    { header: 'Account', key: 'account', width: 30 },
    { header: 'Amount', key: 'amount', width: 15 }
  ];

  // Add data
  const data = [
    { account: 'REVENUE', amount: '' },
    { account: 'Sales Revenue', amount: 50000 },
    { account: '', amount: '' },
    { account: 'EXPENSES', amount: '' },
    { account: 'Cost of Goods Sold', amount: 20000 },
    { account: 'Salaries', amount: 8000 },
    { account: 'Rent', amount: 5000 },
    { account: 'Utilities', amount: 1500 },
    { account: 'Marketing', amount: 2000 },
    { account: '', amount: '' },
    { account: 'TOTAL EXPENSES', amount: 36500 },
    { account: '', amount: '' },
    { account: 'NET PROFIT', amount: 13500 }
  ];

  worksheet.addRows(data);

  // Style the worksheet
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(13).font = { bold: true };

  const fileName = `P&L-${Date.now()}.xlsx`;
  const filePath = path.join(process.cwd(), 'reports', fileName);

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

export async function generateBalanceSheetReport(date, branchId) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Balance Sheet');

  worksheet.columns = [
    { header: 'Assets', key: 'asset', width: 30 },
    { header: 'Amount', key: 'assetAmount', width: 15 },
    { header: 'Liabilities', key: 'liability', width: 30 },
    { header: 'Amount', key: 'liabilityAmount', width: 15 }
  ];

  const data = [
    {
      asset: 'Cash',
      assetAmount: 25000,
      liability: 'Accounts Payable',
      liabilityAmount: 15000
    },
    {
      asset: 'Inventory',
      assetAmount: 75000,
      liability: 'VAT Payable',
      liabilityAmount: 5000
    },
    {
      asset: 'Accounts Receivable',
      assetAmount: 30000,
      liability: 'Total Liabilities',
      liabilityAmount: 20000
    }
  ];

  worksheet.addRows(data);

  const fileName = `BalanceSheet-${Date.now()}.xlsx`;
  const filePath = path.join(process.cwd(), 'reports', fileName);

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

export function generateInvoicePDF(invoice) {
  const doc = new PDFDocument();
  const fileName = `Invoice-${invoice.invoiceNumber}.pdf`;
  const filePath = path.join(process.cwd(), 'reports', fileName);

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', 50, 50);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 50, 80);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 95);

  // Customer Info
  doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 130);
  doc.fontSize(10).font('Helvetica');
  doc.text(`${invoice.customer.name}`, 50, 150);
  doc.text(`Phone: ${invoice.customer.phone}`, 50, 165);
  doc.text(`Email: ${invoice.customer.email}`, 50, 180);

  // Items Table
  doc.fontSize(12).font('Helvetica-Bold').text('Items:', 50, 220);

  let yPosition = 250;
  const tableTop = 240;
  const col1 = 50, col2 = 250, col3 = 350, col4 = 450;

  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Product', col1, tableTop);
  doc.text('Qty', col2, tableTop);
  doc.text('Unit Price', col3, tableTop);
  doc.text('Total', col4, tableTop);

  doc.font('Helvetica');
  invoice.items.forEach((item, index) => {
    const itemY = tableTop + 30 + (index * 25);
    doc.text(item.productName, col1, itemY);
    doc.text(item.quantity.toString(), col2, itemY);
    doc.text(`${item.unitPrice}`, col3, itemY);
    doc.text(`${item.total}`, col4, itemY);
  });

  // Totals
  yPosition = tableTop + 30 + (invoice.items.length + 1) * 25;

  doc.font('Helvetica-Bold');
  doc.text(`Subtotal: ${invoice.subtotal}`, col4 - 100, yPosition);
  doc.text(`Tax: ${invoice.tax}`, col4 - 100, yPosition + 20);
  doc.text(`Total: ${invoice.total}`, col4 - 100, yPosition + 40);

  // Payment info
  doc.fontSize(10).font('Helvetica');
  doc.text(`Payment Method: ${invoice.paymentMethod}`, 50, yPosition + 80);
  doc.text(`Status: ${invoice.paymentStatus}`, 50, yPosition + 100);

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
```

---

## Forecast Engine

```javascript
// backend/utils/forecastEngine.js
export async function generateSalesForecast(historicalData, forecastMonths = 6) {
  try {
    // Simple moving average
    const movingAveragePeriod = 3;
    const forecast = [];

    // Calculate moving averages
    const movingAverages = [];
    for (let i = movingAveragePeriod - 1; i < historicalData.length; i++) {
      const sum = historicalData
        .slice(i - movingAveragePeriod + 1, i + 1)
        .reduce((a, b) => a + b, 0);
      movingAverages.push(sum / movingAveragePeriod);
    }

    // Generate forecast using exponential smoothing
    const alpha = 0.3; // Smoothing factor
    let lastValue = movingAverages[movingAverages.length - 1];

    for (let i = 0; i < forecastMonths; i++) {
      const nextValue = alpha * lastValue + (1 - alpha) * lastValue;
      forecast.push({
        month: i + 1,
        forecastedSales: Math.round(nextValue),
        confidence: 0.85 - (i * 0.02) // Decreasing confidence over time
      });
      lastValue = nextValue;
    }

    return forecast;
  } catch (error) {
    console.error('Error generating forecast:', error);
    throw error;
  }
}

export async function getTopSellingProductsForecast(products, historicalSales) {
  try {
    const productSales = {};

    // Aggregate sales by product
    historicalSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.product]) {
          productSales[item.product] = 0;
        }
        productSales[item.product] += item.quantity;
      });
    });

    // Sort and get top products
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productId, quantity]) => ({
        productId,
        forecastedQuantity: Math.round(quantity * 1.1), // Predict 10% growth
        trend: 'upward'
      }));

    return topProducts;
  } catch (error) {
    console.error('Error generating product forecast:', error);
    throw error;
  }
}
```

---

## Format Utilities

```javascript
// frontend/src/utils/formatters.js
export const formatCurrency = (amount, currency = 'EGP') => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{2})(\d{3})(\d{4})(\d{3})/, '+$1-$2-$3-$4');
};

export const calculateTax = (amount, taxRate = 14) => {
  return (amount * taxRate) / 100;
};

export const calculateDiscount = (amount, discountPercent) => {
  return (amount * discountPercent) / 100;
};

export const calculateProfitMargin = (costPrice, sellingPrice) => {
  return ((sellingPrice - costPrice) / costPrice * 100).toFixed(2);
};
```

---

## Validation Utilities

```javascript
// frontend/src/utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\\+?20?\\d{10}$/;
  return re.test(phone);
};

export const validateSKU = (sku) => {
  return /^[A-Z0-9-]{3,}$/.test(sku);
};

export const validateBarcode = (barcode) => {
  return barcode && barcode.length >= 5;
};

export const validatePrice = (price) => {
  return price > 0;
};

export const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

export const validateFormData = (data, schema) => {
  const errors = {};
  Object.keys(schema).forEach(field => {
    const validator = schema[field];
    if (validator.required && !data[field]) {
      errors[field] = 'This field is required';
    } else if (validator.type === 'email' && !validateEmail(data[field])) {
      errors[field] = 'Invalid email address';
    }
  });
  return errors;
};
```

---

## Constants

```javascript
// frontend/src/utils/constants.js
export const PRODUCT_CATEGORIES = [
  { value: 't_shirts', label: 'T-Shirts' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'jackets', label: 'Jackets' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' }
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_wallet', label: 'Mobile Wallet' }
];

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'sales_employee', label: 'Sales Employee' },
  { value: 'inventory_manager', label: 'Inventory Manager' }
];

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Salaries',
  'Utilities',
  'Transportation',
  'Marketing',
  'Packaging',
  'Internet',
  'Miscellaneous'
];

export const PURCHASE_STATUS = ['Draft', 'Pending', 'Received', 'Cancelled'];

export const SALE_STATUS = ['Completed', 'Cancelled', 'Returned'];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

