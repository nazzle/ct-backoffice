<script setup>
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
      <el-table-column
        v-for="col in columns"
        :key="col.key"
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
    </el-table>

    <!-- Pagination -->
    <div class="flex justify-end mt-4">
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
