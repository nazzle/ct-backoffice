<script setup>
import { onMounted, ref } from 'vue'
import { useSales } from '@/modules/pos/composables/useSales.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { dateFormatter } from '@/components/globals/constants.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { hasPermission } from '@/utils/permissions.js'

const { sales, fetchSales, cancelSaleTransaction, pagination, success } = useSales()
const salesDetailDialog = ref(false)
const selectedSale = ref(null)
const activeTab = ref('all')

const columns = [
  { key: 'id', label: 'Sale #', type: 'index' },
  { key: 'sale_number', label: 'Sale Number' },
]

onMounted(() => {
  fetchSales()
})

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchSales()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchSales()
}

const viewSaleDetails = (sale) => {
  selectedSale.value = sale
  salesDetailDialog.value = true
}

const handleCancelSale = async (sale) => {
  try {
    await ElMessageBox.confirm(`Are you sure you want to cancel Sale #${sale.id}?`, 'Cancel Sale', {
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No',
      type: 'warning',
    })

    await cancelSaleTransaction(sale.id)
    if (success.value) {
      await fetchSales()
    }
  } catch (error) {
    // User cancelled
  }
}

const getStatusType = (status) => {
  const types = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'danger',
  }
  return types[status] || 'info'
}
</script>

<template>
  <div class="sales-management">
    <div class="page-header">
      <h2>Sales Management</h2>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="All Sales" name="all">
        <base-table
          :pagination="pagination"
          :rows="sales"
          :columns="columns"
          @update:page="getNextData"
          @update:pageSize="changePageSize"
        >
          <el-table-column label="Customer">
            <template #default="scope">
              {{ scope.row.customer?.name || 'Walk-in' }}
            </template>
          </el-table-column>
          <el-table-column label="Cashier">
            <template #default="scope">
              {{ scope.row.user?.username || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column label="Payment Method">
            <template #default="scope">
              {{ scope.row.payment_options?.name || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="Date">
            <template #default="scope">
              {{ dateFormatter(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="Status">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status?.toUpperCase() }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Total" align="right">
            <template #default="scope">
              <strong>{{ scope.row.total_amount }}</strong>
            </template>
          </el-table-column>
          <el-table-column label="Paid" align="right">
            <template #default="scope">
              <strong>{{ scope.row.amount_paid }}</strong>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="180">
            <template #default="scope">
              <el-button size="small" plain type="primary" @click="viewSaleDetails(scope.row)">
                <Icon icon="mdi:eye" /> View
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending' && hasPermission('DELETE_SALES')"
                size="small"
                plain
                type="danger"
                @click="handleCancelSale(scope.row)"
              >
                <Icon icon="mdi:cancel" />
              </el-button>
            </template>
          </el-table-column>
        </base-table>
      </el-tab-pane>
    </el-tabs>

    <!-- Sale Details Dialog -->
    <el-dialog
      v-model="salesDetailDialog"
      :title="`Sale Details - #${selectedSale?.id}`"
      width="800px"
    >
      <div v-if="selectedSale" class="sale-details">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-descriptions title="Sale Information" :column="1" border>
              <el-descriptions-item label="Sale ID"> #{{ selectedSale.id }} </el-descriptions-item>
              <el-descriptions-item label="Date">
                {{ dateFormatter(selectedSale.created_at) }}
              </el-descriptions-item>
              <el-descriptions-item label="Status">
                <el-tag :type="getStatusType(selectedSale.status)">
                  {{ selectedSale.status?.toUpperCase() }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="Customer">
                {{ selectedSale.customer?.name || 'Walk-in Customer' }}
              </el-descriptions-item>
              <el-descriptions-item label="Cashier">
                {{ selectedSale.cashier?.name || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="Location">
                {{ selectedSale.location?.name || 'N/A' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions title="Payment Information" :column="1" border>
              <el-descriptions-item label="Payment Method">
                {{ selectedSale.payment_method?.name || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="Reference">
                {{ selectedSale.payment_reference || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="Amount Received">
                {{ selectedSale.amount_received?.toFixed(2) || '0.00' }}
              </el-descriptions-item>
              <el-descriptions-item label="Change">
                {{ selectedSale.change?.toFixed(2) || '0.00' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <el-divider />

        <h3>Items</h3>
        <el-table :data="selectedSale.items || []" border style="width: 100%">
          <el-table-column prop="item.description" label="Item" />
          <el-table-column prop="quantity" label="Qty" width="80" align="center" />
          <el-table-column label="Unit Price" width="120" align="right">
            <template #default="scope">
              {{ scope.row.unit_price?.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="Discount" width="100" align="right">
            <template #default="scope">
              {{ scope.row.discount_amount?.toFixed(2) || '0.00' }}
            </template>
          </el-table-column>
          <el-table-column label="Total" width="120" align="right">
            <template #default="scope">
              <strong>{{
                (
                  scope.row.unit_price * scope.row.quantity -
                  (scope.row.discount_amount || 0)
                ).toFixed(2)
              }}</strong>
            </template>
          </el-table-column>
        </el-table>

        <el-divider />

        <div class="sale-summary">
          <el-row :gutter="20">
            <el-col :span="12" :offset="12">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>{{ selectedSale.subtotal?.toFixed(2) }}</span>
              </div>
              <div v-if="selectedSale.discount_amount > 0" class="summary-row discount">
                <span>Discount:</span>
                <span>-{{ selectedSale.discount_amount?.toFixed(2) }}</span>
              </div>
              <div v-if="selectedSale.tax_amount > 0" class="summary-row tax">
                <span>Tax:</span>
                <span>{{ selectedSale.tax_amount?.toFixed(2) }}</span>
              </div>
              <el-divider />
              <div class="summary-row total">
                <span>TOTAL:</span>
                <span>{{ selectedSale.total?.toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="selectedSale.notes" class="mt-3">
          <el-alert type="info" :closable="false">
            <strong>Notes:</strong> {{ selectedSale.notes }}
          </el-alert>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.sales-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.sale-details {
  padding: 10px 0;
}

.sale-summary {
  margin-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 1rem;
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
}
</style>
