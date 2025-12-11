# Supplier Management & Ledger System - Requirements

> **Feature**: Supplier management with purchase tracking, ledger system, and stock updates
> **Status**: Planning Phase
> **Priority**: HIGH
> **Related**: Inventory Management, Stock Movements, Purchase Management

---

## 🎯 Overview

The Supplier Management system handles:
- Supplier information and contacts
- Purchase orders and invoicing
- Purchase returns to suppliers
- Supplier ledger (accounts payable)
- Automatic stock updates on purchases
- Payment tracking to suppliers

This is the counterpart to the Customer system, but for managing suppliers/vendors.

---

## 📋 Core Requirements

### 1. Supplier Management

**Supplier Model:**
```typescript
export interface Supplier {
  id: number;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string; // NTN, GSTIN, etc.
  paymentTerms?: string; // "Net 30", "Net 60", "COD", etc.
  creditLimit?: number;
  currentBalance: number; // Amount we owe
  notes?: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierDto {
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
  status?: 'active' | 'inactive';
}
```

**Supplier Features:**
- CRUD operations for suppliers
- Search and filter suppliers
- Supplier contact information
- Payment terms and credit limits
- Supplier status management (active/inactive/blocked)
- Supplier notes and history

---

### 2. Purchase Management

**Purchase Model:**
```typescript
export interface Purchase {
  id: number;
  purchaseNumber: string; // PO-2024-00001
  supplierId: number;
  supplier?: Supplier;
  branchId: number;
  userId: number; // Staff who created purchase
  purchaseDate: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  shippingCost: number;
  total: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  amountPaid: number;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  invoiceNumber?: string; // Supplier's invoice number
  notes?: string;
  createdBy?: string;
  receivedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id?: number;
  purchaseId?: number;
  productId: number;
  product?: Product;
  quantity: number;
  receivedQuantity?: number; // For partial deliveries
  unitCost: number; // Cost price from supplier
  discount: number;
  subtotal: number;
}

export interface CreatePurchaseDto {
  supplierId: number;
  branchId: number;
  userId: number;
  purchaseDate: Date;
  expectedDeliveryDate?: Date;
  items: CreatePurchaseItemDto[];
  taxRate: number;
  discountRate: number;
  shippingCost?: number;
  invoiceNumber?: string;
  notes?: string;
}

export interface CreatePurchaseItemDto {
  productId: number;
  quantity: number;
  unitCost: number;
  discount?: number;
}
```

**Purchase Workflow:**
1. **Draft** - Purchase order being created
2. **Ordered** - Sent to supplier, waiting for delivery
3. **Received** - Items received, stock updated
4. **Cancelled** - Order cancelled, no stock update

---

### 3. Purchase Returns (to Supplier)

**Purchase Return Model:**
```typescript
export interface PurchaseReturn {
  id: number;
  returnNumber: string; // PR-2024-00001
  purchaseId: number;
  purchase?: Purchase;
  supplierId: number;
  supplier?: Supplier;
  branchId: number;
  userId: number;
  returnDate: Date;
  items: PurchaseReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  refundMethod: 'cash' | 'bank-transfer' | 'credit-note' | 'adjustment';
  refundAmount: number;
  status: 'pending' | 'processed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseReturnItem {
  id?: number;
  returnId?: number;
  purchaseItemId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitCost: number;
  subtotal: number;
  reason: 'defective' | 'wrong-item' | 'damaged' | 'excess' | 'other';
}
```

**Return to Supplier Logic:**
- Select original purchase order
- Choose items to return
- Specify return quantity (≤ received quantity)
- Provide return reason
- Process refund or credit note
- **Decrease stock** (opposite of purchase increase)
- Update supplier ledger (reduce payable)

---

### 4. Supplier Ledger System

**Purpose**: Track all financial transactions with suppliers (accounts payable).

**Ledger Entry Structure:**
```typescript
export interface SupplierLedgerEntry {
  id: number;
  supplierId: number;
  transactionType: 'PURCHASE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
  transactionDate: Date;
  referenceId: number; // purchaseId, returnId, paymentId
  referenceType: 'purchase' | 'return' | 'payment' | 'adjustment';
  debit: number;   // Amount we pay to supplier (payments, returns)
  credit: number;  // Amount we owe to supplier (purchases)
  balance: number; // Running balance (what we owe)
  description: string;
  branchId: number;
  userId: number;
  createdAt: Date;
}

export interface CreateSupplierLedgerEntryDto {
  supplierId: number;
  transactionType: 'PURCHASE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
  transactionDate: Date;
  referenceId: number;
  referenceType: 'purchase' | 'return' | 'payment' | 'adjustment';
  debit: number;
  credit: number;
  description: string;
  branchId: number;
  userId: number;
}

export interface SupplierAccountSummary {
  supplierId: number;
  supplier?: Supplier;
  totalDebit: number;   // Total paid to supplier
  totalCredit: number;  // Total owed to supplier
  currentBalance: number; // Amount we currently owe
  lastTransactionDate?: Date;
  entriesCount: number;
}
```

**Ledger Transaction Types:**

1. **PURCHASE** (Credit - Increases Payable)
   - We owe money to supplier
   - Debit = 0
   - Credit = purchase total
   - Created when purchase is received

2. **RETURN** (Debit - Decreases Payable)
   - We return items to supplier
   - Debit = return amount
   - Credit = 0
   - Created when return is processed

3. **PAYMENT** (Debit - Decreases Payable)
   - We pay supplier
   - Debit = payment amount
   - Credit = 0
   - Created when payment is made

4. **CREDIT_NOTE** (Debit)
   - Supplier gives us credit
   - Debit = credit amount
   - Credit = 0
   - Applied to future purchases

5. **ADJUSTMENT** (Debit or Credit)
   - Manual correction
   - Can increase or decrease balance
   - Requires approval/reason

**Running Balance Calculation:**
```
Balance = Previous Balance + Credit - Debit

If Balance > 0: We owe supplier money
If Balance < 0: Supplier owes us (rare, usually credit note)
If Balance = 0: Account settled
```

**Example Ledger Flow:**
```
Transaction 1: Purchase of Rs 50,000
  Debit: 0 | Credit: 50,000 | Balance: 50,000 (We owe)

Transaction 2: Payment of Rs 30,000
  Debit: 30,000 | Credit: 0 | Balance: 20,000

Transaction 3: Return of Rs 5,000
  Debit: 5,000 | Credit: 0 | Balance: 15,000

Transaction 4: Payment of Rs 15,000
  Debit: 15,000 | Credit: 0 | Balance: 0 (Settled)
```

---

### 5. Stock Update Logic

**On Purchase Received:**
```
For each purchase item:
  1. Find product in inventory
  2. Find inventory record for receiving branch
  3. Increase stock quantity by purchased quantity
  4. Update product cost price (optional: FIFO, LIFO, Average)
  5. Log stock movement (type: PURCHASE)
  6. Update inventory.updatedAt
```

**On Purchase Return:**
```
For each returned item:
  1. Find product in inventory
  2. Find inventory record for current branch
  3. Decrease stock quantity by return quantity
  4. Log stock movement (type: PURCHASE_RETURN)
  5. Update inventory.updatedAt
```

**Stock Movement Types:**
- `PURCHASE` - Stock increased (supplier purchase)
- `PURCHASE_RETURN` - Stock decreased (return to supplier)
- `SALE` - Stock decreased (customer sale)
- `SALE_RETURN` - Stock increased (customer return)
- `TRANSFER` - Branch to branch
- `ADJUSTMENT` - Manual correction
- `DAMAGE` - Stock damaged/lost

---

### 6. UI/UX Requirements

**Pages to Create:**

1. **Supplier List** (`/suppliers`)
   - Datatable with all suppliers
   - Columns: ID, Name, Company, Phone, Email, Balance, Status, Actions
   - Filters: Status, Search by name/phone
   - Actions: View, Edit, Delete, View Ledger
   - Add Supplier button

2. **Supplier Form** (`/suppliers/new`, `/suppliers/:id/edit`)
   - Reactive form with all supplier fields
   - Validation for required fields
   - Company information section
   - Contact information section
   - Payment terms and limits section
   - Notes section
   - Save/Cancel actions

3. **Supplier Detail View** (`/suppliers/:id`)
   - Supplier information display
   - Current balance prominently displayed
   - Tabs:
     - Overview (basic info)
     - Purchases (list of all purchases)
     - Ledger (all transactions)
     - Products (products supplied)
   - Action buttons: Edit, Make Payment, Add Purchase

4. **Purchase List** (`/purchases`)
   - Datatable with all purchases
   - Columns: PO Number, Date, Supplier, Total, Paid, Status, Actions
   - Filters: Date range, Supplier, Status, Payment Status
   - Actions: View, Edit (if draft), Receive, Print PO
   - Add Purchase button

5. **Purchase Form** (`/purchases/new`, `/purchases/:id/edit`)
   - Similar to sale-form layout
   - Supplier selection
   - Purchase date and expected delivery
   - Items section with product selection
   - Quantity and unit cost per item
   - Tax and discount calculation
   - Shipping cost
   - Summary section
   - Notes field
   - Submit/Cancel actions

6. **Purchase Receive Form** (`/purchases/:id/receive`)
   - Display purchase items
   - Input received quantity per item (can be less than ordered)
   - Actual delivery date
   - Notes about delivery
   - Mark as fully/partially received
   - On submit: Update stock, create ledger entry

7. **Purchase Return Form** (`/purchases/returns/new`)
   - Select original purchase
   - Display purchase items
   - Select items to return
   - Specify return quantity and reason
   - Refund method selection
   - Calculate refund amount
   - Submit/Cancel actions

8. **Purchase Returns List** (`/purchases/returns`)
   - Datatable with all purchase returns
   - Columns: Return ID, Date, Supplier, Purchase, Items, Amount, Status, Actions
   - Filters: Date range, Supplier, Status

9. **Supplier Ledger View** (`/suppliers/:id/ledger`)
   - Part of supplier detail page
   - Datatable with all ledger entries
   - Columns: Date, Type, Reference, Description, Debit, Credit, Balance
   - Running balance display
   - Filters: Date range, Transaction type
   - Export to PDF/Excel
   - Print ledger statement

10. **Make Payment to Supplier** (`/suppliers/:id/payment`)
    - Supplier information display
    - Current outstanding balance
    - Payment amount input
    - Payment date
    - Payment method (cash, bank transfer, check)
    - Reference number (check no, transaction ID)
    - Notes
    - Submit/Cancel actions
    - On submit: Create ledger entry, update balance

---

### 7. Domain Structure

**New Domain Library: `@samba/supplier-domain`**

```
libs/samba/domain/supplier/
├── src/
│   ├── index.ts
│   ├── lib/
│   │   ├── models/
│   │   │   └── supplier.models.ts
│   │   ├── services/
│   │   │   └── supplier.service.ts
│   │   └── store/
│   │       └── supplier.store.ts
```

**New Domain Library: `@samba/purchase-domain`**

```
libs/samba/domain/purchase/
├── src/
│   ├── index.ts
│   ├── lib/
│   │   ├── models/
│   │   │   └── purchase.models.ts
│   │   ├── services/
│   │   │   └── purchase.service.ts
│   │   └── store/
│   │       └── purchase.store.ts
```

**Extend Ledger Domain:** Add supplier ledger to existing `@samba/ledger-domain`

---

### 8. Backend/API Requirements

**Supplier Endpoints:**
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier
- `GET /api/suppliers/:id/purchases` - Get supplier's purchases
- `GET /api/suppliers/:id/balance` - Get supplier current balance

**Purchase Endpoints:**
- `POST /api/purchases` - Create purchase order
- `GET /api/purchases` - List all purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `PUT /api/purchases/:id` - Update purchase (if draft)
- `POST /api/purchases/:id/receive` - Mark purchase as received
- `DELETE /api/purchases/:id` - Cancel purchase
- `GET /api/purchases/:id/returnable-items` - Get returnable items

**Purchase Return Endpoints:**
- `POST /api/purchase-returns` - Create purchase return
- `GET /api/purchase-returns` - List all returns
- `GET /api/purchase-returns/:id` - Get return by ID
- `PUT /api/purchase-returns/:id` - Update return
- `DELETE /api/purchase-returns/:id` - Cancel return

**Supplier Ledger Endpoints:**
- `GET /api/suppliers/:supplierId/ledger` - Get supplier ledger entries
- `POST /api/suppliers/:supplierId/payment` - Record payment to supplier
- `GET /api/ledger/supplier-summary` - Get summary for all suppliers
- `GET /api/ledger/payables` - Get suppliers with outstanding payables

---

### 9. Business Rules

1. **Purchase Workflow**: Draft → Ordered → Received → (Stock Updated + Ledger Entry)
2. **Partial Delivery**: Support receiving less than ordered quantity
3. **Purchase Returns**: Only returnable if purchase was received
4. **Return Window**: Returns allowed within 90 days of purchase (configurable)
5. **Stock Update**: Only update stock when purchase status = "received"
6. **Cost Price**: Update product cost price on purchase receive (optional)
7. **Ledger Entry**: Create automatically on purchase receive, not on order
8. **Payment Terms**: Track payment due dates based on supplier terms
9. **Credit Limit**: Warn if purchase exceeds supplier credit limit
10. **Multi-Branch**: Purchases are branch-specific, affect that branch's inventory

---

### 10. Reports Required

1. **Purchase Report**
   - Date range filter
   - Purchases by supplier
   - Purchases by product
   - Total purchase amount
   - Payment status breakdown

2. **Purchase Returns Report**
   - Returns by supplier
   - Returns by reason
   - Total return amount
   - Return rate

3. **Supplier Ledger Report**
   - Per supplier or all suppliers
   - Outstanding payables
   - Payment history
   - Export to PDF/Excel

4. **Stock Received Report**
   - Items received by date
   - By supplier
   - By product category
   - Quantity and value

5. **Supplier Performance**
   - On-time delivery rate
   - Return rate by supplier
   - Average cost comparison

6. **Accounts Payable Aging**
   - Outstanding payables by age
   - 0-30 days, 31-60 days, 61-90 days, 90+ days
   - Overdue payments

---

### 11. Widgets for Dashboard

1. **Total Purchases This Month** - Metric widget
2. **Outstanding Payables** - Total amount owed to all suppliers
3. **Pending Purchase Orders** - Count of orders not yet received
4. **Recent Purchases** - List of latest purchases
5. **Top Suppliers** - By purchase volume
6. **Purchase Returns Rate** - Percentage of purchases returned
7. **Payment Due Alerts** - Suppliers with overdue payments

---

### 12. Implementation Order

**Phase 1: Supplier Management**
1. Create supplier domain library
2. Create supplier models, service, store
3. Create supplier list page
4. Create supplier form (create/edit)
5. Create supplier detail view

**Phase 2: Purchase Management**
1. Create purchase domain library
2. Create purchase models, service, store
3. Create purchase form UI
4. Create purchase list page
5. Implement purchase receive functionality
6. Add stock update on receive
7. Add ledger entry on receive

**Phase 3: Purchase Returns**
1. Add purchase return models to purchase domain
2. Create purchase return form
3. Create purchase returns list
4. Implement return processing
5. Add stock decrease on return
6. Add ledger update on return

**Phase 4: Ledger System**
1. Extend ledger domain for supplier ledger
2. Create supplier ledger view
3. Implement payment recording
4. Add payment form/modal
5. Calculate and display balances
6. Add manual adjustments (admin only)

**Phase 5: Reports and Dashboard**
1. Create purchase reports
2. Create supplier ledger reports
3. Add dashboard widgets
4. Create payables aging report
5. Create supplier performance report

**Phase 6: Advanced Features**
1. Purchase order approval workflow
2. Automatic payment reminders
3. Supplier performance scoring
4. Integration with accounting system
5. Multiple currencies support
6. Import purchases from supplier invoices

---

### 13. Mock API Data

**For `mock-api/db.json`:**
```json
{
  "suppliers": [
    {
      "id": 1,
      "name": "Tech Supplies Co.",
      "companyName": "Tech Supplies Private Limited",
      "contactPerson": "Ahmed Khan",
      "email": "ahmed@techsupplies.com",
      "phone": "+92-300-1234567",
      "address": "123 Industrial Area, Karachi",
      "city": "Karachi",
      "country": "Pakistan",
      "taxId": "NTN-1234567",
      "paymentTerms": "Net 30",
      "creditLimit": 500000,
      "currentBalance": 150000,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "purchases": [
    {
      "id": 1,
      "purchaseNumber": "PO-2024-00001",
      "supplierId": 1,
      "branchId": 1,
      "userId": 1,
      "purchaseDate": "2024-01-10T10:00:00Z",
      "expectedDeliveryDate": "2024-01-15T00:00:00Z",
      "deliveryDate": "2024-01-14T14:30:00Z",
      "items": [
        {
          "id": 1,
          "productId": 5,
          "quantity": 50,
          "receivedQuantity": 50,
          "unitCost": 3000,
          "discount": 0,
          "subtotal": 150000
        }
      ],
      "subtotal": 150000,
      "tax": 15000,
      "taxRate": 0.1,
      "discount": 5000,
      "discountRate": 0.033,
      "shippingCost": 2000,
      "total": 162000,
      "paymentStatus": "paid",
      "amountPaid": 162000,
      "status": "received",
      "invoiceNumber": "INV-2024-001",
      "notes": "First batch of new products",
      "createdBy": "Admin User",
      "receivedBy": "Warehouse Manager",
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-14T14:30:00Z"
    }
  ],
  "purchaseReturns": [],
  "supplierLedger": [
    {
      "id": 1,
      "supplierId": 1,
      "transactionType": "PURCHASE",
      "transactionDate": "2024-01-14T14:30:00Z",
      "referenceId": 1,
      "referenceType": "purchase",
      "debit": 0,
      "credit": 162000,
      "balance": 162000,
      "description": "Purchase Order PO-2024-00001 received",
      "branchId": 1,
      "userId": 1,
      "createdAt": "2024-01-14T14:30:00Z"
    },
    {
      "id": 2,
      "supplierId": 1,
      "transactionType": "PAYMENT",
      "transactionDate": "2024-01-15T10:00:00Z",
      "referenceId": 1,
      "referenceType": "payment",
      "debit": 12000,
      "credit": 0,
      "balance": 150000,
      "description": "Payment via Bank Transfer - TXN123456",
      "branchId": 1,
      "userId": 1,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### 14. Integration Points

**With Inventory:**
- Purchase receive → Increase stock
- Purchase return → Decrease stock
- Update cost price on receive

**With Ledger:**
- Purchase receive → Create credit entry
- Purchase return → Create debit entry
- Payment → Create debit entry

**With Product:**
- Track which suppliers provide which products
- Supplier price history per product
- Preferred supplier per product

**With Branch:**
- Purchases are branch-specific
- Stock updates apply to purchasing branch
- Multi-branch purchase coordination

---

### 15. Advanced Features (Future)

1. **Automatic Reordering**: Generate purchase orders when stock falls below threshold
2. **Price Comparison**: Compare prices across suppliers for same product
3. **Supplier Rating**: Rate suppliers on quality, delivery, pricing
4. **Purchase Budgets**: Set and track purchase budgets per category/month
5. **Multi-Currency**: Handle purchases in different currencies
6. **Landed Cost**: Calculate true cost including shipping, taxes, duties
7. **Consignment Stock**: Track supplier-owned inventory
8. **Drop Shipping**: Orders fulfilled directly by supplier to customer

---

## 🔗 Related Features

- **Customer Returns** (Opposite flow)
- **Customer Ledger** (Accounts receivable)
- **Stock Audit** (Verify physical vs system stock)
- **Cost Analysis** (Product cost trends)

---

## ⚠️ Technical Considerations

1. **Transaction Integrity**: Purchase processing must be atomic
2. **Cost Calculation**: Choose cost method (FIFO, LIFO, Average, Specific)
3. **Multi-Branch**: Ensure purchases update correct branch inventory
4. **Concurrency**: Handle concurrent purchases and stock updates
5. **Performance**: Ledger queries can be expensive - use pagination
6. **Audit Trail**: All purchase and stock changes must be logged
7. **Data Retention**: Purchases and ledger never deleted (soft delete)

---

## 📚 Reference Implementations

- Check customer-domain for similar patterns: [libs/samba/domain/customer/](../../../libs/samba/domain/customer/)
- Check sale-domain for transaction patterns: [libs/samba/domain/sale/](../../../libs/samba/domain/sale/)
- Check sale-form for form structure: [apps/samba-web/src/app/features/sales/sale-form/](../features/sales/sale-form/)
- Check Shell app for UI patterns: [apps/shell/](../../shell/)

---

**Next Steps**: Review requirements, prioritize features, then start with Phase 1 (Supplier Management).
