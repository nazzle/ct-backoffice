import api from '@/api/axios.js'

// exporting locations end-points constants
export const getPaginatedLocations = (page, perPage) =>
  api.get(`/locations`, {
    params: { page, per_page: perPage },
  })
export const createLocation  = (locationDto) => api.post(`/locations` , locationDto)
export const updateLocation = (locationDto, locationId) => api.put(`/locations/${locationId}`, locationDto)
export const updateLocationStatus = (locationId) => api.patch(`/locations/${locationId}/delete`)
export const getAllLocations = () => api.get(`/locations/all`)
