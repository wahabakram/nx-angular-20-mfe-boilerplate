# Customer Returns & Ledger System - Requirements

> **Feature**: Customer return/refund system with automatic stock and ledger updates
> **Status**: Planning Phase
> **Priority**: HIGH
> **Related**: Stock Management, Customer Ledger, Inventory Domain

---

## 🎯 Overview

The Customer Returns system allows processing product returns from customers, managing refunds, updating inventory stock, and maintaining accurate customer ledger records. This system is critical for:
- Customer satisfaction (processing returns/exchanges)
- Accurate inventory tracking
- Financial accuracy (customer account balances)
- Audit trail and compliance

---

## 📋 Core Requirements

### 1. Return/Refund Processing

**Return Form:**
- Select original sale (by receipt number or search)
- Display original sale items
- Select items to return (partial or full return)
- Specify return quantity for each item (≤ original quantity)
- Return reason (dropdown: Defective, Wrong Item, Customer Changed Mind, Damaged, Other)
- Refund method (Cash, Card, Credit Note, Exchange)
- Return date/time (default: current)
- Notes/Comments (optional)
- Staff member processing return (from auth)

**Validation:**
- Cannot return more items than originally sold
- Cannot return items from paid sales older than return policy period (e.g., 30 days)
- Must specify return reason
- Original sale must exist and be valid

**Return Types:**
1. **Full Refund** - All items returned, full amount refunded
2. **Partial Refund** - Some items returned, prorated refund
3. **Exchange** - Items returned and exchanged for different products (value difference handled)
4. **Credit Note** - Return processed, amount added to customer credit balance

---

### 2. Stock Update Logic

**Automatic Inventory Adjustment:**

When a return is processed:
```
For each returned item:
  1. Find product in inventory (by productId)
  2. Find inventory record for current branch
  3. Increase stock quantity by return quantity
  4. Update inventory.updatedAt timestamp
  5. Log stock movement in audit trail
```

**Stock Movement Types:**
- `SALE` - Stock decreased (original sale)
- `RETURN` - Stock increased (customer return)
- `ADJUSTMENT` - Manual correction
- `TRANSFER` - Branch to branch
- `PURCHASE` - Supplier purchase (increases stock)
- `DAMAGE` - Stock damaged/lost

**Example:**
```typescript
// Original Sale (decreases stock)
Product: iPhone 14, Quantity: 2
Inventory Before: 50
Inventory After: 48 (50 - 2)

// Customer Return (increases stock)
Return Quantity: 1
Inventory Before: 48
Inventory After: 49 (48 + 1)
```

---

### 3. Customer Ledger System

**Purpose**: Track all financial transactions with customers including sales, returns, payments, and credit.

**Ledger Entry Structure:**
```typescript
interface CustomerLedgerEntry {
  id: number;
  customerId: number;
  transactionType: 'SALE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
  transactionDate: Date;
  referenceId: number; // saleId, returnId, paymentId
  referenceType: 'sale' | 'return' | 'payment' | 'adjustment';
  debit: number;   // Amount customer owes (sales)
  credit: number;  // Amount customer is owed (returns, payments)
  balance: number; // Running balance
  description: string;
  branchId: number;
  userId: number; // Staff member who processed
  createdAt: Date;
}
```

**Ledger Transaction Types:**

1. **SALE** (Debit)
   - Increases customer debt
   - Debit = sale total amount
   - Credit = 0
   - Created when sale is completed

2. **RETURN** (Credit)
   - Decreases customer debt or adds credit
   - Debit = 0
   - Credit = return amount
   - Created when return is processed

3. **PAYMENT** (Credit)
   - Customer makes payment
   - Debit = 0
   - Credit = payment amount
   - Created when payment is received

4. **CREDIT_NOTE** (Credit)
   - Store credit issued to customer
   - Debit = 0
   - Credit = credit amount
   - Can be used for future purchases

5. **ADJUSTMENT** (Debit or Credit)
   - Manual correction by admin
   - Used for dispute resolution, corrections
   - Requires approval/reason

**Running Balance Calculation:**
```
Balance = Previous Balance + Debit - Credit

If Balance > 0: Customer owes money
If Balance < 0: Customer has credit
If Balance = 0: Account settled
```

**Example Ledger Flow:**
```
Transaction 1: Sale of Rs 10,000
  Debit: 10,000 | Credit: 0 | Balance: 10,000

Transaction 2: Payment of Rs 6,000
  Debit: 0 | Credit: 6,000 | Balance: 4,000

Transaction 3: Return of Rs 2,000
  Debit: 0 | Credit: 2,000 | Balance: 2,000

Transaction 4: Payment of Rs 2,000
  Debit: 0 | Credit: 2,000 | Balance: 0 (Settled)
```

---

### 4. UI/UX Requirements

**Pages to Create:**

1. **Customer Return Form** (`/sales/returns/new`)
   - Similar layout to sale-form
   - Sale selection/search at top
   - Display original sale items
   - Checkboxes to select items for return
   - Quantity input for each selected item
   - Return reason dropdown
   - Refund method selection
   - Calculated refund amount (read-only)
   - Notes field
   - Submit/Cancel actions

2. **Returns List** (`/sales/returns`)
   - Datatable with all returns
   - Columns: Return ID, Date, Customer, Original Sale, Items Count, Refund Amount, Status, Actions
   - Filters: Date range, Customer, Status, Branch
   - Actions: View, Print Return Receipt

3. **Return Detail View** (`/sales/returns/:id`)
   - Display return information
   - Original sale reference (link)
   - Returned items table
   - Refund details
   - Stock adjustment summary
   - Ledger entry reference
   - Timeline of events

4. **Customer Ledger View** (`/customers/:id/ledger`)
   - Part of customer detail page
   - Datatable with all ledger entries
   - Columns: Date, Type, Reference, Description, Debit, Credit, Balance
   - Running balance display
   - Filters: Date range, Transaction type
   - Export to PDF/Excel
   - Print ledger statement

5. **Customer Account Summary Widget** (Dashboard)
   - Total outstanding balance across all customers
   - List of top debtors
   - Recent credit transactions
   - Alerts for overdue accounts

---

### 5. Domain Structure

**New Domain Library: `@samba/return-domain`**

```
libs/samba/domain/return/
├── src/
│   ├── index.ts
│   ├── lib/
│   │   ├── models/
│   │   │   └── return.models.ts
│   │   ├── services/
│   │   │   └── return.service.ts
│   │   └── store/
│   │       └── return.store.ts
```

**Models:**
```typescript
export interface Return {
  id: number;
  returnNumber: string; // RET-2024-00001
  saleId: number;
  sale?: Sale;
  customerId: number;
  customer?: Customer;
  branchId: number;
  userId: number; // Staff processing return
  returnDate: Date;
  items: ReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  refundMethod: 'cash' | 'card' | 'credit-note' | 'exchange';
  refundAmount: number;
  status: 'pending' | 'processed' | 'cancelled';
  notes?: string;
  processedBy?: string; // User name
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnItem {
  id?: number;
  returnId?: number;
  saleItemId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  reason: 'defective' | 'wrong-item' | 'changed-mind' | 'damaged' | 'other';
}

export interface CreateReturnDto {
  saleId: number;
  customerId: number;
  branchId: number;
  userId: number;
  items: CreateReturnItemDto[];
  refundMethod: 'cash' | 'card' | 'credit-note' | 'exchange';
  notes?: string;
}

export interface CreateReturnItemDto {
  saleItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  reason: 'defective' | 'wrong-item' | 'changed-mind' | 'damaged' | 'other';
}
```

**New Domain Library: `@samba/ledger-domain`**

```
libs/samba/domain/ledger/
├── src/
│   ├── index.ts
│   ├── lib/
│   │   ├── models/
│   │   │   └── ledger.models.ts
│   │   ├── services/
│   │   │   └── ledger.service.ts
│   │   └── store/
│   │       └── ledger.store.ts
```

**Models:**
```typescript
export interface CustomerLedgerEntry {
  id: number;
  customerId: number;
  transactionType: 'SALE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
  transactionDate: Date;
  referenceId: number;
  referenceType: 'sale' | 'return' | 'payment' | 'adjustment';
  debit: number;
  credit: number;
  balance: number;
  description: string;
  branchId: number;
  userId: number;
  createdAt: Date;
}

export interface CreateLedgerEntryDto {
  customerId: number;
  transactionType: 'SALE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
  transactionDate: Date;
  referenceId: number;
  referenceType: 'sale' | 'return' | 'payment' | 'adjustment';
  debit: number;
  credit: number;
  description: string;
  branchId: number;
  userId: number;
}

export interface CustomerAccountSummary {
  customerId: number;
  customer?: Customer;
  totalDebit: number;
  totalCredit: number;
  currentBalance: number;
  lastTransactionDate?: Date;
  entriesCount: number;
}
```

---

### 6. Backend/API Requirements

**Return Endpoints:**
- `POST /api/returns` - Create new return
- `GET /api/returns` - List all returns (with filters)
- `GET /api/returns/:id` - Get return by ID
- `PUT /api/returns/:id` - Update return (if pending)
- `DELETE /api/returns/:id` - Cancel return (if pending)
- `GET /api/sales/:saleId/returnable-items` - Get items that can be returned from a sale

**Ledger Endpoints:**
- `GET /api/customers/:customerId/ledger` - Get customer ledger entries
- `GET /api/customers/:customerId/balance` - Get customer current balance
- `POST /api/ledger/entries` - Create ledger entry (manual adjustment)
- `GET /api/ledger/summary` - Get summary for all customers
- `GET /api/ledger/outstanding` - Get customers with outstanding balances

**Stock Adjustment (Internal):**
- Return processing should automatically call inventory update APIs
- Stock movements logged in inventory audit trail

---

### 7. Business Rules

1. **Return Window**: Returns allowed within 30 days of sale (configurable)
2. **Partial Returns**: Customers can return some items from a sale
3. **Multiple Returns**: Same sale can have multiple return transactions (if partial)
4. **Return Limits**: Cannot return more than originally purchased
5. **Defective Returns**: Mark items as defective, prevent re-stocking
6. **Exchange Process**: Process as return + new sale
7. **Credit Notes**: Valid for 1 year, can be applied to future purchases
8. **Ledger Integrity**: Every sale/return creates a ledger entry automatically
9. **Balance Limits**: Customers can have credit balance (store credit)
10. **Permission Required**: Only authorized staff can process returns/adjustments

---

### 8. Stock Movement Audit Trail

**Purpose**: Track all inventory changes for compliance and debugging

**Audit Entry Structure:**
```typescript
interface StockMovement {
  id: number;
  productId: number;
  branchId: number;
  movementType: 'SALE' | 'RETURN' | 'PURCHASE' | 'TRANSFER' | 'ADJUSTMENT' | 'DAMAGE';
  quantityChange: number; // Negative for decrease, positive for increase
  quantityBefore: number;
  quantityAfter: number;
  referenceId: number; // saleId, returnId, transferId, etc.
  referenceType: string;
  userId: number;
  notes?: string;
  createdAt: Date;
}
```

**Stock Movement Rules:**
- SALE: `quantityChange = -sold_quantity`
- RETURN: `quantityChange = +returned_quantity`
- PURCHASE: `quantityChange = +purchased_quantity`
- TRANSFER OUT: `quantityChange = -transferred_quantity`
- TRANSFER IN: `quantityChange = +received_quantity`
- ADJUSTMENT: `quantityChange = adjusted_quantity` (can be + or -)
- DAMAGE: `quantityChange = -damaged_quantity`

---

### 9. Reports Required

1. **Returns Report**
   - Date range filter
   - Returns by product
   - Returns by reason
   - Returns by customer
   - Total refund amount
   - Return rate (% of sales)

2. **Customer Ledger Report**
   - Per customer or all customers
   - Date range filter
   - Transaction summary
   - Outstanding balances
   - Export to PDF/Excel

3. **Stock Movement Report**
   - All stock changes
   - By product
   - By movement type
   - Date range filter
   - Audit trail

4. **Customer Account Aging**
   - Outstanding balances by age
   - 0-30 days, 31-60 days, 61-90 days, 90+ days
   - Overdue accounts

---

### 10. Widgets for Dashboard

1. **Total Returns This Month** - Metric widget
2. **Return Rate** - Percentage of sales returned
3. **Outstanding Customer Balances** - Total across all customers
4. **Recent Returns** - List of latest returns
5. **Top Returned Products** - Products with most returns
6. **Customer Credit Summary** - Customers with credit balances

---

### 11. Implementation Order

**Phase 1: Core Return Functionality**
1. Create return domain library (`@samba/return-domain`)
2. Create return models, service, store
3. Create return form UI (`/sales/returns/new`)
4. Implement sale selection and item display
5. Implement return processing logic
6. Add stock update on return

**Phase 2: Ledger System**
1. Create ledger domain library (`@samba/ledger-domain`)
2. Create ledger models, service, store
3. Implement automatic ledger entries on sale/return
4. Create customer ledger view UI
5. Add ledger balance calculation
6. Implement manual adjustments (admin only)

**Phase 3: Lists and Details**
1. Create returns list page
2. Create return detail page
3. Add return receipt printing
4. Add customer balance display to customer details

**Phase 4: Reports and Dashboard**
1. Create returns report
2. Create ledger report
3. Add dashboard widgets
4. Create stock movement audit report
5. Create customer aging report

**Phase 5: Advanced Features**
1. Return approval workflow (if required)
2. Automatic credit note application
3. Return notifications (SMS/Email)
4. Integration with accounting system

---

### 12. Mock API Endpoints

**For `mock-api/db.json`:**
```json
{
  "returns": [],
  "customerLedger": [],
  "stockMovements": []
}
```

**Mock Data Examples:**
```json
{
  "id": 1,
  "returnNumber": "RET-2024-00001",
  "saleId": 123,
  "customerId": 5,
  "branchId": 1,
  "userId": 2,
  "returnDate": "2024-01-15T10:30:00Z",
  "items": [
    {
      "id": 1,
      "saleItemId": 456,
      "productId": 10,
      "quantity": 1,
      "unitPrice": 5000,
      "subtotal": 5000,
      "reason": "defective"
    }
  ],
  "subtotal": 5000,
  "tax": 500,
  "total": 5500,
  "refundMethod": "cash",
  "refundAmount": 5500,
  "status": "processed",
  "notes": "Screen was cracked",
  "processedBy": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 🔗 Related Features

- **Supplier Ledger** (Similar to customer ledger but for suppliers)
- **Purchase Returns** (Return items to supplier)
- **Stock Audit** (Physical stock count vs system)
- **Accounting Integration** (Sync with accounting software)

---

## ⚠️ Technical Considerations

1. **Transaction Integrity**: Returns must be atomic - stock update and ledger entry must both succeed or both fail
2. **Concurrency**: Handle concurrent returns and stock updates
3. **Offline Support**: Cache return data if offline, sync when online
4. **Performance**: Ledger queries can be slow for customers with many transactions - implement pagination
5. **Data Retention**: Returns and ledger entries should never be deleted (soft delete only)
6. **Audit Compliance**: All changes must be logged for financial auditing

---

## 📚 Reference Implementations

- Check Shell app for form patterns: [apps/shell/src/app/](../../shell/)
- Check existing sale-form for similar structure: [apps/samba-web/src/app/features/sales/sale-form/](../features/sales/sale-form/)
- Check existing domain libraries: [libs/samba/domain/](../../../libs/samba/domain/)

---

**Next Steps**: Review requirements with stakeholders, then proceed with Phase 1 implementation.
