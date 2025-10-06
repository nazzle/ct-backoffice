# POS (Point of Sale) Module

A comprehensive, modern, and responsive Point of Sale system with full sales management capabilities.

## Features

### 🛒 POS Interface (`POSInterface.vue`)

#### Header Section

- **Real-time Clock**: Live date and time display
- **Location Selector**: Select current store/warehouse location
- **Cashier Info**: Display logged-in cashier details

#### Product Selection Panel

- **Search Bar**: Real-time product search by name/description
- **Barcode Scanner**: Scan products by barcode (Enter to add)
- **Product Grid**: Visual product cards with images
- **Product Display**: Shows name, barcode, and price
- **Click to Add**: Click any product card to add to cart

#### Cart Panel

- **Customer Management**:

  - Add/remove customers
  - Display customer loyalty points
  - Walk-in customer support

- **Cart Items**:

  - Item name and unit price
  - Quantity adjustment (input number)
  - Individual item discounts (fixed or percentage)
  - Remove items from cart
  - Real-time total calculation per item

- **Cart Summary**:

  - Subtotal (before discounts/tax)
  - Item-level discounts
  - Global discount (from discount definitions)
  - Tax calculation (configurable tax rates)
  - Grand total
  - Total items count

- **Action Buttons**:
  - **Discount**: Apply global discounts and taxes
  - **Save**: Save as pending sale
  - **Clear**: Clear entire cart
  - **Pay**: Open payment dialog

#### Payment Processing

- **Payment Method Selection**: Choose from configured payment options
- **Amount Received**: Enter amount received from customer
- **Change Calculation**: Automatic change calculation
- **Payment Reference**: Optional reference number
- **Complete Sale**: Finalize transaction

### 📊 Sales Management (`SalesManagement.vue`)

#### Sales History

- **Comprehensive Table**: View all sales with pagination
- **Columns**:
  - Sale number
  - Customer name (or Walk-in)
  - Cashier name
  - Payment method
  - Date and time
  - Status (Completed, Pending, Cancelled)
  - Total amount

#### Sale Details Dialog

- **Sale Information**:

  - Sale ID and date
  - Customer details
  - Cashier information
  - Location
  - Status

- **Payment Information**:

  - Payment method
  - Payment reference
  - Amount received
  - Change given

- **Items Breakdown**:

  - List of all items sold
  - Quantities
  - Unit prices
  - Discounts per item
  - Item totals

- **Financial Summary**:

  - Subtotal
  - Total discounts
  - Tax amount
  - Grand total

- **Notes**: Any additional notes for the sale

#### Actions

- **View Details**: View complete sale information
- **Cancel Sale**: Cancel pending sales (with confirmation)

## API Endpoints

### Sales API (`/src/modules/pos/api/sales.js`)

```javascript
GET    /sales                    // Paginated sales list
GET    /sales/:id                // Get sale by ID
POST   /sales                    // Create new sale
PUT    /sales/:id                // Update sale
POST   /sales/:id/complete       // Complete sale with payment
PATCH  /sales/:id/cancel         // Cancel sale
GET    /sales/pending            // Get pending sales
GET    /sales/completed          // Get completed sales
GET    /sales/summary            // Get sales summary/statistics
GET    /sales/:id/receipt        // Print receipt
```

### POS API (`/src/modules/pos/api/pos.js`)

```javascript
GET    /pos/items/search         // Search items
GET    /pos/items/barcode/:code  // Get item by barcode
GET    /pos/stock/check          // Check available stock
POST   /pos/hold                 // Hold current sale
GET    /pos/held-sales           // Get held sales
GET    /pos/held-sales/:id       // Retrieve held sale
DELETE /pos/held-sales/:id       // Delete held sale
```

## Composables

### `useCart()`

Manages the shopping cart state and calculations.

**State:**

- `cartItems` - Array of items in cart
- `selectedCustomer` - Current customer
- `selectedLocation` - Current location
- `appliedDiscount` - Applied global discount
- `appliedTax` - Applied tax
- `notes` - Sale notes

**Computed:**

- `subtotal` - Cart subtotal
- `itemsDiscountTotal` - Total item discounts
- `cartDiscountAmount` - Global discount amount
- `totalAfterDiscount` - Total after all discounts
- `taxAmount` - Calculated tax
- `grandTotal` - Final amount
- `totalItems` - Total item count

**Methods:**

- `addToCart(item, quantity)` - Add item to cart
- `removeFromCart(itemId)` - Remove item
- `updateQuantity(itemId, quantity)` - Update quantity
- `updateItemDiscount(itemId, discount, type)` - Apply item discount
- `applyDiscount(discount)` - Apply global discount
- `applyTax(tax)` - Apply tax
- `setCustomer(customer)` - Set customer
- `setLocation(location)` - Set location
- `clearCart()` - Clear entire cart
- `getCartData()` - Get cart data for API

### `useSales()`

Manages sales operations and data.

**Methods:**

- `fetchSales(params)` - Fetch sales list
- `fetchPendingSales()` - Fetch pending sales
- `fetchCompletedSales()` - Fetch completed sales
- `fetchSaleById(id)` - Get sale details
- `saveSale(data, isPending)` - Create new sale
- `completeSaleTransaction(id, paymentData)` - Complete sale
- `cancelSaleTransaction(id)` - Cancel sale
- `fetchSalesSummary(params)` - Get sales statistics

### `usePOS()`

POS-specific operations.

**Methods:**

- `searchPOSItems(query, locationId)` - Search items
- `scanBarcode(barcode, locationId)` - Scan barcode
- `checkStock(itemId, locationId)` - Check stock
- `holdCurrentSale(cartData)` - Hold sale
- `fetchHeldSales()` - Get held sales
- `retrieveSale(id)` - Retrieve held sale
- `removeHeldSale(id)` - Delete held sale

## Mathematical Calculations

### Item Level

```javascript
// Item Subtotal
itemSubtotal = unitPrice × quantity

// Item Discount
if (discountType === 'percentage') {
  itemDiscount = itemSubtotal × (discount / 100)
} else {
  itemDiscount = discount
}

// Item Total
itemTotal = itemSubtotal - itemDiscount
```

### Cart Level

```javascript
// Cart Subtotal
subtotal = Σ(itemSubtotal)

// Items Discount Total
itemsDiscountTotal = Σ(itemDiscount)

// Cart Discount (Global)
if (discountType === 'percentage') {
  cartDiscount = (subtotal - itemsDiscountTotal) × (discount / 100)
} else {
  cartDiscount = discount
}

// Total After Discount
totalAfterDiscount = subtotal - itemsDiscountTotal - cartDiscount

// Tax Amount
taxAmount = totalAfterDiscount × (taxRate / 100)

// Grand Total
grandTotal = totalAfterDiscount + taxAmount

// Change
change = amountReceived - grandTotal
```

## Database Schema (Expected)

### Sales Table

```sql
CREATE TABLE sales (
  id BIGINT PRIMARY KEY,
  customer_id BIGINT NULLABLE,
  location_id BIGINT,
  cashier_id BIGINT,
  discount_id BIGINT NULLABLE,
  tax_id BIGINT NULLABLE,
  payment_method_id BIGINT NULLABLE,
  subtotal DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  total DECIMAL(10,2),
  amount_received DECIMAL(10,2),
  change DECIMAL(10,2),
  payment_reference VARCHAR(255),
  status ENUM('pending', 'completed', 'cancelled'),
  notes TEXT,
  timestamps
)
```

### Sale Items Table

```sql
CREATE TABLE sale_items (
  id BIGINT PRIMARY KEY,
  sale_id BIGINT,
  item_id BIGINT,
  quantity INT,
  unit_price DECIMAL(10,2),
  discount DECIMAL(10,2),
  discount_type ENUM('fixed', 'percentage'),
  timestamps
)
```

## Permissions Required

- `VIEW_SALES` - View POS module
- `CREATE_SALES` - Access POS interface and create sales
- `UPDATE_SALES` - Update sale details
- `DELETE_SALES` - Cancel sales

## Responsive Design

The POS interface is fully responsive:

- **Desktop (>1200px)**: Full split view (products | cart)
- **Tablet (992px-1200px)**: Narrower cart panel
- **Mobile (<992px)**: Stacked layout (products above cart)

## Key UX Features

1. **Real-time Search**: Products appear as you type
2. **Barcode Integration**: Quick product entry via scanner
3. **Visual Feedback**: Color-coded status tags and alerts
4. **Error Prevention**: Validation before sale completion
5. **Confirmation Dialogs**: Safety prompts for destructive actions
6. **Auto-calculations**: All math happens automatically
7. **Keyboard Shortcuts**: Enter key for barcode search
8. **Toast Messages**: Success/error notifications
9. **Empty States**: Clear guidance when no data
10. **Loading States**: Visual feedback during operations

## Future Enhancements

- Receipt printing
- Offline mode support
- Held sales retrieval UI
- Sales analytics dashboard
- Multi-currency support
- Split payment methods
- Returns/refunds processing
- Gift card support
- Batch operations
- Export functionality
