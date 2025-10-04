import api from '@/api/axios.js'

// Countries API endpoints
export const getCountries = (page, perPage) =>
  api.get(`/countries`, {
    params: { page, per_page: perPage },
  })

export const createCountry = (countryDto) => api.post(`/countries`, countryDto)

export const updateCountry = (countryDto, countryId) =>
  api.put(`/countries/${countryId}`, countryDto)

export const updateCountryStatus = (countryId) =>
  api.patch(`/countries/${countryId}/delete`)

export const deleteCountry = (countryId) => api.delete(`/countries/${countryId}`)

export const getAllCountries = () => api.get(`/countries/all`)
