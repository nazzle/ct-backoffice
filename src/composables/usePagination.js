import { ref } from "vue";

const pagination = ref({
  page: 1,
  pageSize: 10,
  totalItems: 0,
});

export function usePagination() {
  return {
    pagination,
  };
}
