<script setup>
import { dateFormatter } from '@/components/globals/constants.js'

const props = defineProps({
  columns: { type: Array, required: true }, // [{ key, label, width?, align? }]
  rows: { type: Array, required: true },
  pagination: {
    type: Object,
    required: true,
    // expected shape: { page, pageSize, totalItems }
  },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:page", "update:pageSize"]);

function handlePageChange(page) {
  emit("update:page", page);
}

function handleSizeChange(size) {
  emit("update:pageSize", size);
}

function indexNumber(scope) {
  return props.pagination?.page !== 0 ? Math.abs((props.pagination?.page - 1) * props.pagination?.pageSize + scope.$index + 1) : (scope.$index + 1)
}

</script>

<template>
  <div class="w-full">
    <!-- Dynamic Table -->
    <el-table
      :data="props.rows"
      border
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ backgroundColor: '#f5f7fa', fontWeight: 'bold' }"
    >
      <template v-for="col in columns" :key="col.key">
        <el-table-column v-if="col.type === 'index' " :label="col.label" width="90">
          <template #default="scope">
            {{indexNumber(scope)}}
          </template>
        </el-table-column>
        <el-table-column v-else-if="col.key === 'active' " label="Status">
          <template #default="scope">
            <el-tag :type="scope.row.active ? 'primary' : 'danger'">
              {{ scope.row[col.key] ? 'Active' : 'Inactive' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else-if=" col.key === 'created_at' " label="Date">
          <template #default="scope">
            {{ dateFormatter(scope.row[col.key]) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.key"
          :label="col.label"
          :width="col.width || null"
          :align="col.align || 'left'"
        >
          <!-- custom cell rendering slot -->
          <template #default="scope">
            <slot :name="`col-${col.key}`" :row="scope.row">
              {{ scope.row[col.key] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <slot />
    </el-table>

    <!-- Pagination -->
    <div class="flex justify-end mt-5 pt-5">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalItems"
        :page-size="pagination.pageSize"
        :current-page="pagination.page"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
