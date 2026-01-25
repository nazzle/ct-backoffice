import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export function useCart() {
  const cartItems = ref([])
  const selectedCustomer = ref(null)
  const selectedLocation = ref(null)
  const appliedDiscount = ref(null)
  const appliedTax = ref(null)
  const notes = ref('')

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    console.log('Item: ', item)
    const existingItem = cartItems.value.find((i) => i.id === item.id)

    if (existingItem) {
      existingItem.quantity += quantity
      ElMessage.success(`Updated ${item.description} quantity`)
    } else {
      cartItems.value.push({
        ...item,
        quantity,
        discount: 0,
        discount_type: 'fixed', // fixed or percentage
      })
      ElMessage.success(`Added ${item?.item?.description} to cart`)
    }
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex((i) => i.id === itemId)
    if (index > -1) {
      const item = cartItems.value[index]
      cartItems.value.splice(index, 1)
      ElMessage.info(`Removed ${item?.item?.description} from cart`)
    }
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    const item = cartItems.value.find((i) => i.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  // Update item discount
  const updateItemDiscount = (itemId, discount, discountType = 'fixed') => {
    const item = cartItems.value.find((i) => i.id === itemId)
    if (item) {
      item.discount = discount
      item.discount_type = discountType
    }
  }

  // Calculate item subtotal
  const getItemSubtotal = (item) => {
    return item?.item?.selling_price * item.quantity
  }

  // Calculate item discount amount
  const getItemDiscountAmount = (item) => {
    const subtotal = getItemSubtotal(item)
    if (item.discount_type === 'percentage') {
      return (subtotal * item.discount) / 100
    }
    return item.discount
  }

  // Calculate item total after discount
  const getItemTotal = (item) => {
    return getItemSubtotal(item) - getItemDiscountAmount(item)
  }

  // Cart subtotal (before discounts and tax)
  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + getItemSubtotal(item), 0)
  })

  // Cart items discount total
  const itemsDiscountTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + getItemDiscountAmount(item), 0)
  })

  // Cart discount amount (global discount)
  const cartDiscountAmount = computed(() => {
    if (!appliedDiscount.value) return 0

    const baseAmount = subtotal.value - itemsDiscountTotal.value

    if (appliedDiscount.value.type === 'percentage') {
      return (baseAmount * appliedDiscount.value.value) / 100
    }
    return appliedDiscount.value.value
  })

  // Total after all discounts
  const totalAfterDiscount = computed(() => {
    return subtotal.value - itemsDiscountTotal.value - cartDiscountAmount.value
  })

  // Tax amount
  const taxAmount = computed(() => {
    if (!appliedTax.value) return 0
    return (totalAfterDiscount.value * appliedTax.value.rate) / 100
  })

  // Grand total
  const grandTotal = computed(() => {
    return totalAfterDiscount.value + taxAmount.value
  })

  // Total items count
  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // Apply global discount
  const applyDiscount = (discount) => {
    appliedDiscount.value = discount
    if (discount) {
      ElMessage.success(`Applied ${discount.name} discount`)
    }
  }

  // Remove global discount
  const removeDiscount = () => {
    appliedDiscount.value = null
    ElMessage.info('Discount removed')
  }

  // Apply tax
  const applyTax = (tax) => {
    appliedTax.value = tax
    if (tax) {
      ElMessage.success(`Applied ${tax.name} tax (${tax.rate}%)`)
    }
  }

  // Remove tax
  const removeTax = () => {
    appliedTax.value = null
    ElMessage.info('Tax removed')
  }

  // Set customer
  const setCustomer = (customer) => {
    selectedCustomer.value = customer
    if (customer) {
      ElMessage.success(`Customer: ${customer.name}`)
    }
  }

  // Remove customer
  const removeCustomer = () => {
    selectedCustomer.value = null
    ElMessage.info('Customer removed')
  }

  // Set location
  const setLocation = (location) => {
    selectedLocation.value = location
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    selectedCustomer.value = null
    appliedDiscount.value = null
    appliedTax.value = null
    notes.value = ''
    ElMessage.info('Cart cleared')
  }

  // Get cart data for API
  const getCartData = () => {
    console.log('Cart data item: ', cartItems)
    return {
      customer_id: selectedCustomer.value?.id || null,
      items: cartItems.value.map((item) => ({
        item_id: item?.item.id,
        quantity: item.quantity,
        unit_price: Number(item?.item.selling_price),
        total_price: getItemSubtotal(item),
        discount: item.discount,
        discount_type: item.discount_type,
      })),
      discount_id: appliedDiscount.value?.id || null,
      tax_id: appliedTax.value?.id || null,
      subtotal: subtotal.value,
      discount_amount: itemsDiscountTotal.value + cartDiscountAmount.value,
      tax_amount: taxAmount.value,
      total: grandTotal.value,
      notes: notes.value,
    }
  }

  return {
    // State
    cartItems,
    selectedCustomer,
    selectedLocation,
    appliedDiscount,
    appliedTax,
    notes,

    // Computed
    subtotal,
    itemsDiscountTotal,
    cartDiscountAmount,
    totalAfterDiscount,
    taxAmount,
    grandTotal,
    totalItems,

    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemDiscount,
    getItemSubtotal,
    getItemDiscountAmount,
    getItemTotal,
    applyDiscount,
    removeDiscount,
    applyTax,
    removeTax,
    setCustomer,
    removeCustomer,
    setLocation,
    clearCart,
    getCartData,
  }
}
