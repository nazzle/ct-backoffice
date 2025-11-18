import api from '@/api/axios.js'

// exporting required auths end-points constants
export const getActiveLocationList = () => api.get(`/locations-public`, {})
