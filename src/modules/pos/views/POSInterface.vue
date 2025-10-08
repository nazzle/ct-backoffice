<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCart } from '@/modules/pos/composables/useCart.js'
import { usePOS } from '@/modules/pos/composables/usePOS.js'
import { useSales } from '@/modules/pos/composables/useSales.js'
import { useLocation } from '@/modules/inventory/composables/useLocation.js'
import { useCustomer } from '@/modules/reference-data/composables/useCustomer.js'
import { useTax } from '@/modules/configuration/composables/useTax.js'
import { useDiscountDefinition } from '@/modules/configuration/composables/useDiscountDefinition.js'
import { usePaymentOption } from '@/modules/configuration/composables/usePaymentOption.js'
import { useUser } from '@/modules/hr/composables/useUser.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// Composables
const cart = useCart()
const pos = usePOS()
const sales = useSales()
const { allLocations, getNonPaginatedLocationList } = useLocation()
const { allCustomers, getNonPaginatedCustomers } = useCustomer()
const { allTaxes, getNonPaginatedTaxes } = useTax()
const { allDiscountDefinitions, getNonPaginatedDiscountDefinitions } = useDiscountDefinition()
const { allPaymentOptions, getNonPaginatedPaymentOptions } = usePaymentOption()
const { myProfile, getUserProfile } = useUser()

// State
const searchQuery = ref('')
const barcodeInput = ref('')
const selectedCategory = ref(null)
const paymentDialogVisible = ref(false)
const customerDialogVisible = ref(false)
const discountDialogVisible = ref(false)
const itemDiscountDialogVisible = ref(false)
const selectedItemForDiscount = ref(null)
const currentTime = ref(new Date())

// Payment state
const paymentMethod = ref(null)
const amountReceived = ref(0)
const paymentReference = ref('')

// Lifecycle
onMounted(() => {
  getUserProfile()
  getNonPaginatedLocationList()
  getNonPaginatedCustomers()
  getNonPaginatedTaxes()
  getNonPaginatedDiscountDefinitions()
  getNonPaginatedPaymentOptions()
  pos.fetchHeldSales()

  // Update time every second
  setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

// Watchers
watch(searchQuery, (newVal) => {
  if (newVal) {
    pos.searchPOSItems(newVal, cart.selectedLocation.value?.id)
  } else {
    pos.searchResults.value = []
  }
})

watch(
  () => cart.selectedLocation.value,
  (newLocation) => {
    if (newLocation && searchQuery.value) {
      pos.searchPOSItems(searchQuery.value, newLocation.id)
    }
  },
)

// Computed
const change = computed(() => {
  const diff = amountReceived.value - cart.grandTotal.value
  return diff > 0 ? diff : 0
})

const formattedTime = computed(() => {
  return currentTime.value.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

// Methods
const handleBarcodeSearch = async () => {
  if (!barcodeInput.value) return
  const item = await pos.scanBarcode(barcodeInput.value, cart.selectedLocation.value?.id)
  if (item) {
    cart.addToCart(item, 1)
  }
  barcodeInput.value = ''
}

const handleItemSearch = async () => {
  if (!searchQuery.value) return
  const item = await pos.searchPOSItems(searchQuery.value, cart.selectedLocation.value?.id)
  if (item) {
    cart.addToCart(item, 1)
  }
  barcodeInput.value = ''
}

const handleItemClick = (item) => {
  cart.addToCart(item, 1)
  searchQuery.value = ''
  pos.searchResults.value = []
}

const openPaymentDialog = () => {
  if (cart.cartItems.value.length === 0) {
    ElMessage.warning('Cart is empty')
    return
  }
  if (!cart.selectedLocation.value) {
    ElMessage.warning('Please select a location')
    return
  }

  amountReceived.value = cart.grandTotal.value
  paymentDialogVisible.value = true
}

const completeSale = async () => {
  if (!paymentMethod.value) {
    ElMessage.warning('Please select a payment method')
    return
  }

  if (amountReceived.value < cart.grandTotal.value) {
    ElMessage.warning('Amount received is less than total')
    return
  }

  const saleData = {
    ...cart.getCartData(),
    payment_method_id: paymentMethod.value,
    amount_received: amountReceived.value,
    change: change.value,
    payment_reference: paymentReference.value,
    cashier_id: myProfile.value?.id,
    status: 'completed',
  }

  const result = await sales.saveSale(saleData, false)

  if (sales.success.value) {
    ElMessage.success({
      message: 'Sale completed successfully!',
      duration: 2000,
    })

    paymentDialogVisible.value = false
    resetPOS()
  }
}

const savePendingSale = async () => {
  if (cart.cartItems.value.length === 0) {
    ElMessage.warning('Cart is empty')
    return
  }

  const saleData = {
    ...cart.getCartData(),
    cashier_id: myProfile.value?.id,
    status: 'pending',
  }

  const result = await sales.saveSale(saleData, true)

  if (sales.success.value) {
    ElMessage.success('Sale saved as pending')
    cart.clearCart()
  }
}

const holdSale = async () => {
  if (cart.cartItems.value.length === 0) {
    ElMessage.warning('Cart is empty')
    return
  }

  const heldSale = await pos.holdCurrentSale({
    ...cart.getCartData(),
    cashier_id: myProfile.value?.id,
  })

  if (heldSale) {
    cart.clearCart()
  }
}

const retrieveHeldSale = async (heldSale) => {
  // Implement held sale retrieval logic
  ElMessage.info('Feature coming soon')
}

const resetPOS = () => {
  cart.clearCart()
  paymentMethod.value = null
  amountReceived.value = 0
  paymentReference.value = ''
  searchQuery.value = ''
}

const openItemDiscountDialog = (item) => {
  selectedItemForDiscount.value = item
  itemDiscountDialogVisible.value = true
}

const applyItemDiscount = () => {
  if (selectedItemForDiscount.value) {
    cart.updateItemDiscount(
      selectedItemForDiscount.value.id,
      selectedItemForDiscount.value.discount,
      selectedItemForDiscount.value.discount_type,
    )
    itemDiscountDialogVisible.value = false
  }
}

const clearCart = async () => {
  try {
    await ElMessageBox.confirm('Are you sure you want to clear the cart?', 'Warning', {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    })
    cart.clearCart()
  } catch (error) {
    // User cancelled
  }
}
</script>

<template>
  <div class="pos-interface">
    <!-- Header -->
    <div class="pos-header">
      <div class="header-left">
        <h2 class="pos-title">
          <Icon icon="mdi:point-of-sale" width="32" height="32" /> Point of Sale
        </h2>
      </div>
      <div class="header-center">
        <div class="time-display">{{ formattedTime }}</div>
      </div>
      <div class="header-right">
        <el-select
          v-model="cart.selectedLocation.value"
          placeholder="Select Location"
          class="location-select"
          value-key="id"
        >
          <el-option
            v-for="location in allLocations"
            :key="location.id"
            :label="location.name"
            :value="location"
          />
        </el-select>
        <div class="cashier-info">
          <Icon icon="mdi:account-circle" width="24" height="24" />
          <span>{{ myProfile?.name || 'Cashier' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pos-main">
      <!-- Left Panel - Products -->
      <div class="products-panel">
        <!-- Search Bar -->
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
            clearable
            @keyup="handleItemSearch"
          >
            <template #prefix>
              <Icon icon="mdi:magnify" width="20" height="20" />
            </template>
          </el-input>
          <el-input
            v-model="barcodeInput"
            placeholder="Scan barcode..."
            class="barcode-input"
            @keyup.enter="handleBarcodeSearch"
          >
            <template #prefix>
              <Icon icon="mdi:barcode-scan" width="20" height="20" />
            </template>
          </el-input>
        </div>

        <!-- Search Results -->
        <div v-if="pos.searchResults.value.length > 0" class="search-results">
          <div
            v-for="item in pos.searchResults.value"
            :key="item.id"
            class="product-card search-result"
            @click="handleItemClick(item)"
          >
            <div class="product-image">
              <img
                v-if="item?.image"
                :src="item?.item?.image"
                :alt="item?.item?.description"
                @error="(e) => (e.target.src = '/placeholder-product.png')"
              />
              <div v-else class="placeholder-image">
                <Icon icon="mdi:package-variant" width="48" height="48" />
              </div>
            </div>
            <div class="product-info">
              <div class="product-name">{{ item?.item?.description }}</div>
              <div class="product-code">{{ item?.item?.barcode }}</div>
              <div class="product-price">{{ item?.item?.selling_price }}</div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!searchQuery" class="empty-state">
          <Icon icon="mdi:magnify" width="64" height="64" />
          <p>Search for products or scan barcode</p>
        </div>
      </div>

      <!-- Right Panel - Cart -->
      <div class="cart-panel">
        <!-- Customer Section -->
        <div class="customer-section">
          <div v-if="cart.selectedCustomer.value" class="customer-selected">
            <div class="customer-details">
              <Icon icon="mdi:account" width="20" height="20" />
              <span>{{ cart.selectedCustomer.value.name }}</span>
              <el-tag size="small" type="info">
                Points: {{ cart.selectedCustomer.value.loyalty_points }}
              </el-tag>
            </div>
            <el-button size="small" text type="danger" @click="cart.removeCustomer()">
              <Icon icon="mdi:close" />
            </el-button>
          </div>
          <el-button v-else type="primary" plain size="small" @click="customerDialogVisible = true">
            <Icon icon="mdi:account-plus" width="16" height="16" /> Add Customer
          </el-button>
        </div>

        <!-- Cart Items -->
        <div class="cart-items">
          <div v-if="cart.cartItems.value.length === 0" class="empty-cart">
            <Icon icon="mdi:cart-outline" width="64" height="64" />
            <p>Cart is empty</p>
          </div>
          <div v-for="item in cart.cartItems.value" :key="item.id" class="cart-item">
            <div class="item-details">
              <div class="item-name">{{ item?.item?.description }}</div>
              <div class="item-price">{{ item?.item?.selling_price }} each</div>
              <div v-if="item.discount > 0" class="item-discount">
                Discount:
                {{ item.discount_type === 'percentage' ? `${item.discount}%` : item.discount }}
              </div>
            </div>
            <div class="item-controls">
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="999"
                size="small"
                @change="(val) => cart.updateQuantity(item.id, val)"
              />
              <div class="item-total">{{ cart.getItemTotal(item).toFixed(2) }}</div>
              <el-button-group>
                <el-button size="small" plain @click="openItemDiscountDialog(item)">
                  <Icon icon="mdi:percent" />
                </el-button>
                <el-button size="small" type="danger" plain @click="cart.removeFromCart(item.id)">
                  <Icon icon="mdi:delete" />
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span class="amount">{{ cart.subtotal.value.toFixed(2) }}</span>
          </div>
          <div v-if="cart.itemsDiscountTotal.value > 0" class="summary-row discount">
            <span>Item Discounts:</span>
            <span class="amount">-{{ cart.itemsDiscountTotal.value.toFixed(2) }}</span>
          </div>
          <div v-if="cart.appliedDiscount.value" class="summary-row discount">
            <span>
              {{ cart.appliedDiscount.value.name }}
              <el-button size="small" text type="danger" @click="cart.removeDiscount()">
                <Icon icon="mdi:close" />
              </el-button>
            </span>
            <span class="amount">-{{ cart.cartDiscountAmount.value.toFixed(2) }}</span>
          </div>
          <div v-if="cart.appliedTax.value" class="summary-row tax">
            <span>
              {{ cart.appliedTax.value.name }} ({{ cart.appliedTax.value.rate }}%)
              <el-button size="small" text type="danger" @click="cart.removeTax()">
                <Icon icon="mdi:close" />
              </el-button>
            </span>
            <span class="amount">{{ cart.taxAmount.value.toFixed(2) }}</span>
          </div>
          <el-divider />
          <div class="summary-row total">
            <span>TOTAL:</span>
            <span class="amount">{{ cart.grandTotal.value.toFixed(2) }}</span>
          </div>
          <div class="summary-row items-count">
            <span>{{ cart.totalItems.value }} item(s)</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button
                type="info"
                plain
                size="large"
                style="width: 100%"
                @click="discountDialogVisible = true"
                :disabled="cart.cartItems.value.length === 0"
              >
                <Icon icon="mdi:ticket-percent" width="20" height="20" /> Discount
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                type="warning"
                plain
                size="large"
                style="width: 100%"
                @click="savePendingSale"
                :disabled="cart.cartItems.value.length === 0"
              >
                <Icon icon="mdi:content-save" width="20" height="20" /> Save
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="mt-2">
            <el-col :span="12">
              <el-button
                type="danger"
                plain
                size="large"
                style="width: 100%"
                @click="clearCart"
                :disabled="cart.cartItems.value.length === 0"
              >
                <Icon icon="mdi:delete-sweep" width="20" height="20" /> Clear
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                type="success"
                size="large"
                style="width: 100%"
                @click="openPaymentDialog"
                :disabled="cart.cartItems.value.length === 0"
              >
                <Icon icon="mdi:cash-register" width="20" height="20" /> Pay
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!-- Customer Dialog -->
    <el-dialog v-model="customerDialogVisible" title="Select Customer" width="600px">
      <el-select
        :model-value="cart.selectedCustomer.value"
        placeholder="Search customer..."
        filterable
        style="width: 100%"
        value-key="id"
        @change="
          (val) => {
            cart.setCustomer(val)
            customerDialogVisible = false
          }
        "
      >
        <el-option
          v-for="customer in allCustomers"
          :key="customer.id"
          :label="`${customer.name} - ${customer.phone || 'N/A'}`"
          :value="customer"
        />
      </el-select>
    </el-dialog>

    <!-- Discount Dialog -->
    <el-dialog v-model="discountDialogVisible" title="Apply Discount" width="500px">
      <el-select
        :model-value="cart.appliedDiscount.value"
        placeholder="Select discount..."
        style="width: 100%"
        value-key="id"
        @change="
          (val) => {
            cart.applyDiscount(val)
            discountDialogVisible = false
          }
        "
      >
        <el-option
          v-for="discount in allDiscountDefinitions"
          :key="discount.id"
          :label="`${discount.name} (${discount.type === 'percentage' ? discount.value + '%' : discount.value})`"
          :value="discount"
        />
      </el-select>
      <div class="mt-3">
        <el-select
          :model-value="cart.appliedTax.value"
          placeholder="Select tax..."
          style="width: 100%"
          value-key="id"
          @change="
            (val) => {
              cart.applyTax(val)
            }
          "
        >
          <el-option
            v-for="tax in allTaxes"
            :key="tax.id"
            :label="`${tax.name} (${tax.rate}%)`"
            :value="tax"
          />
        </el-select>
      </div>
    </el-dialog>

    <!-- Item Discount Dialog -->
    <el-dialog v-model="itemDiscountDialogVisible" title="Item Discount" width="400px">
      <div v-if="selectedItemForDiscount">
        <el-form label-position="top">
          <el-form-item label="Discount Type">
            <el-select v-model="selectedItemForDiscount.discount_type" style="width: 100%">
              <el-option label="Fixed Amount" value="fixed" />
              <el-option label="Percentage" value="percentage" />
            </el-select>
          </el-form-item>
          <el-form-item label="Discount Value">
            <el-input-number
              v-model="selectedItemForDiscount.discount"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="applyItemDiscount">Apply</el-button>
      </div>
    </el-dialog>

    <!-- Payment Dialog -->
    <el-dialog v-model="paymentDialogVisible" title="Complete Payment" width="600px">
      <div class="payment-dialog">
        <div class="payment-total">
          <h2>Total Amount</h2>
          <div class="total-amount">{{ cart.grandTotal.value.toFixed(2) }}</div>
        </div>

        <el-form label-position="top">
          <el-form-item label="Payment Method" required>
            <el-select
              v-model="paymentMethod"
              placeholder="Select payment method"
              style="width: 100%"
            >
              <el-option
                v-for="method in allPaymentOptions"
                :key="method.id"
                :label="method.name"
                :value="method.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Amount Received" required>
            <el-input-number
              v-model="amountReceived"
              :min="0"
              :precision="2"
              style="width: 100%"
              size="large"
            />
          </el-form-item>

          <el-form-item label="Payment Reference (Optional)">
            <el-input v-model="paymentReference" placeholder="Reference number..." />
          </el-form-item>

          <div v-if="change > 0" class="change-amount">
            <span>Change:</span>
            <span class="amount">{{ change.toFixed(2) }}</span>
          </div>
        </el-form>

        <el-row :gutter="10" class="mt-3">
          <el-col :span="12">
            <el-button size="large" style="width: 100%" @click="paymentDialogVisible = false">
              Cancel
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="success" size="large" style="width: 100%" @click="completeSale">
              Complete Sale
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.pos-interface {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.pos-header {
  background: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.pos-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #409eff;
}

.time-display {
  font-size: 1.1rem;
  font-weight: 500;
  color: #606266;
}

.header-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.location-select {
  width: 200px;
}

.cashier-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f9ff;
  border-radius: 6px;
  color: #409eff;
  font-weight: 500;
}

.pos-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 1rem;
  padding: 1rem;
  overflow: hidden;
}

.products-panel,
.cart-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.search-container {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #ebeef5;
}

.search-input {
  flex: 2;
}

.barcode-input {
  flex: 1;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  align-content: start;
}

.product-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  color: #dcdfe6;
}

.product-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-code {
  font-size: 0.75rem;
  color: #909399;
  margin-bottom: 0.25rem;
}

.product-price {
  font-weight: 600;
  color: #409eff;
  font-size: 1rem;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  gap: 1rem;
}

.cart-panel {
  display: flex;
  flex-direction: column;
}

.customer-section {
  padding: 1rem;
  border-bottom: 1px solid #ebeef5;
}

.customer-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 6px;
}

.customer-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #c0c4cc;
  gap: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s;
}

.cart-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-price {
  font-size: 0.85rem;
  color: #909399;
}

.item-discount {
  font-size: 0.85rem;
  color: #67c23a;
  margin-top: 0.25rem;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.item-total {
  font-weight: 600;
  font-size: 1.1rem;
  color: #409eff;
}

.cart-summary {
  padding: 1rem;
  border-top: 2px solid #ebeef5;
  background: #fafafa;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.summary-row.discount {
  color: #67c23a;
}

.summary-row.tax {
  color: #e6a23c;
}

.summary-row.total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #303133;
  margin-top: 0.5rem;
}

.summary-row.items-count {
  font-size: 0.85rem;
  color: #909399;
  justify-content: center;
}

.amount {
  font-weight: 600;
}

.action-buttons {
  padding: 1rem;
  border-top: 1px solid #ebeef5;
}

.payment-dialog {
  padding: 1rem 0;
}

.payment-total {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.payment-total h2 {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  opacity: 0.9;
}

.total-amount {
  font-size: 3rem;
  font-weight: 700;
}

.change-amount {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #409eff;
}

/* Responsive */
@media (max-width: 1200px) {
  .pos-main {
    grid-template-columns: 1fr 400px;
  }
}

@media (max-width: 992px) {
  .pos-main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
