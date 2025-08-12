import { ref, onMounted } from 'vue'

export default function useUser(userId) {
  const user = ref(null)
  const loading = ref(false)

  async function fetchUser() {
    loading.value = true
    user.value = await fetch(`/api/users/${userId}`)
    loading.value = false
  }

  onMounted(fetchUser)

  return { user, loading, fetchUser }
}
