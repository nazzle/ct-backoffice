import api from '@/api/axios.js'

export const userReauthentication = (credentials) => api.post(`/reauth`, credentials)
