# MongoDB Schemas & Models

## User Model

```javascript
// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'accountant', 'sales_employee', 'inventory_manager'],
    default: 'sales_employee',
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', userSchema);
```

---

## Product Model

```javascript
// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['t_shirts', 'dresses', 'jeans', 'jackets', 'shoes', 'accessories'],
    required: true,
  },
  brand: String,
  color: [String],
  size: [String],
  
  // Pricing
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  profitMargin: {
    type: Number,
    default: function() {
      return ((this.sellingPrice - this.costPrice) / this.costPrice * 100).toFixed(2);
    }
  },
  
  // Inventory
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  minimumStock: {
    type: Number,
    default: 10,
  },
  
  // Images
  images: [{
    url: String,
    alt: String,
  }],
  
  // Relationships
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Product', productSchema);
```

---

## Sales Model

```javascript
// models/Sales.js
import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  }
}, { _id: true });

const salesSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  
  items: [saleItemSchema],
  
  // Calculations
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'mobile_wallet'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'paid',
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  
  // References
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  salesperson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Metadata
  notes: String,
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'returned'],
    default: 'completed',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Sales', salesSchema);
```

---

## Purchase Model

```javascript
// models/Purchase.js
import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitCost: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  }
}, { _id: true });

const purchaseSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  
  items: [purchaseItemSchema],
  
  // Calculations
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'received', 'cancelled'],
    default: 'pending',
  },
  
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid',
  },
  
  amountPaid: {
    type: Number,
    default: 0,
  },
  
  // Dates
  expectedDelivery: Date,
  actualDelivery: Date,
  
  // References
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Purchase', purchaseSchema);
```

---

## Customer Model

```javascript
// models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  
  // Loyalty & Credit
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  totalPurchases: {
    type: Number,
    default: 0,
  },
  outstandingBalance: {
    type: Number,
    default: 0,
  },
  
  // Metadata
  customerType: {
    type: String,
    enum: ['retail', 'wholesale'],
    default: 'retail',
  },
  taxId: String,
  
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  lastPurchaseDate: Date,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Customer', customerSchema);
```

---

## Inventory Model

```javascript
// models/Inventory.js
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  
  type: {
    type: String,
    enum: ['stock_in', 'stock_out', 'adjustment', 'transfer', 'damaged', 'returned'],
    required: true,
  },
  
  quantity: {
    type: Number,
    required: true,
  },
  
  reason: String,
  
  reference: {
    model: String,
    id: mongoose.Schema.Types.ObjectId,
  },
  
  costPrice: Number,
  totalValue: Number,
  
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  notes: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  }
});

export default mongoose.model('Inventory', inventorySchema);
```

---

## Expense Model

```javascript
// models/Expense.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  
  category: {
    type: String,
    enum: ['rent', 'salaries', 'utilities', 'transportation', 'marketing', 'packaging', 'internet', 'miscellaneous'],
    required: true,
  },
  
  amount: {
    type: Number,
    required: true,
  },
  
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'card', 'cheque'],
    required: true,
  },
  
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft',
  },
  
  receiptUrl: String,
  
  notes: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Expense', expenseSchema);
```

---

## Journal Entry Model (Accounting)

```javascript
// models/JournalEntry.js
import mongoose from 'mongoose';

const journalLineSchema = new mongoose.Schema({
  accountCode: {
    type: String,
    required: true,
  },
  accountName: String,
  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const journalEntrySchema = new mongoose.Schema({
  journalNumber: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  
  entryDate: {
    type: Date,
    default: Date.now,
    required: true,
    index: true,
  },
  
  lines: [journalLineSchema],
  
  totalDebit: {
    type: Number,
    required: true,
  },
  
  totalCredit: {
    type: Number,
    required: true,
  },
  
  reference: {
    model: String,
    id: mongoose.Schema.Types.ObjectId,
  },
  
  status: {
    type: String,
    enum: ['draft', 'posted', 'reversed'],
    default: 'draft',
  },
  
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  notes: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('JournalEntry', journalEntrySchema);
```

---

## Branch Model

```javascript
// models/Branch.js
import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  
  code: {
    type: String,
    required: true,
    unique: true,
  },
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  
  phone: String,
  email: String,
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  currency: {
    type: String,
    default: 'EGP',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Branch', branchSchema);
```

---

## Tax Settings Model

```javascript
// models/Tax.js
import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  rate: {
    type: Number,
    required: true,
  },
  
  type: {
    type: String,
    enum: ['vat', 'sales_tax', 'service_tax'],
    required: true,
  },
  
  isInclusive: {
    type: Boolean,
    default: false,
  },
  
  applicableCategories: [String],
  
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Tax', taxSchema);
```

---

## Supplier Model

```javascript
// models/Supplier.js
import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  
  phone: String,
  email: String,
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  
  taxId: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    swiftCode: String,
  },
  
  paymentTerms: String,
  
  totalPurchases: {
    type: Number,
    default: 0,
  },
  
  outstandingDues: {
    type: Number,
    default: 0,
  },
  
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Supplier', supplierSchema);
```

