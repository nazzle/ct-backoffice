<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
      default: '',
    }
  })
</script>

<template>
  <div class="pl-3 pr-3 pb-3">
    <!--  Page header  -->
    <el-row :gutter="20">
      <el-col :md="24" class="page-title border">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <span class="font-sizePx17 font-weight500">{{props.title}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-title {
  padding: 7px 0;
  border-radius: 5px;
  background: #F4F4F4;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 9px;
}
</style>
