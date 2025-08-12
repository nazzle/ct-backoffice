import { ElMessageBox } from 'element-plus'
import axios from '@/plugins/axios'
import { userReauthentication } from '@/api/auth.js'

// export async function showReauthPrompt(originalConfig) {
//   const password = await ElMessageBox.prompt(
//     'Your session has expired. Please re-enter your password to continue.',
//     'Session Expired',
//     {
//       confirmButtonText: 'Re-authenticate',
//       cancelButtonText: 'Cancel',
//       inputType: 'password',
//       inputPlaceholder: 'Enter your password',
//     }
//   ).then(res => res.value)
//
//   const username = localStorage.getItem('user')
//
//   // Send reauth request to backend
//   const credentials = {
//     username: username,
//     password: password,
//   }
//
//   const { data } = await userReauthentication(credentials)
//   const newToken = data.access_token
//   localStorage.setItem('token', newToken)
//   localStorage.setItem('token_expire', data.expires_at)
//
//   // Set the new token and retry original request
//   originalConfig.headers.Authorization = `Bearer ${newToken}`
//   return axios(originalConfig)
// }

let isRefreshing = false
let requestQueue = []

export async function showReauthPrompt(originalConfig) {
  if (isRefreshing) {
    // Queue the request until token refresh is complete
    return new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject, config: originalConfig })
    })
  }

  isRefreshing = true

  try {
    const password = await ElMessageBox({
      title: 'Session Expired',
      message: 'Your session has expired. Please re-enter your password to continue.',
      inputType: 'password',
      inputPlaceholder: 'Enter your password',
      confirmButtonText: 'Re-authenticate',
      cancelButtonText: 'Cancel',
      showInput: true,
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          try {
            const username = localStorage.getItem('user')
            const credentials = { username, password: instance.inputValue }
            const { data } = await userReauthentication(credentials)

            localStorage.setItem('token', data.access_token)
            localStorage.setItem('token_expire', data.expires_at)

            done()
          } catch (e) {
            instance.inputErrorMessage = 'Authentication failed. Try again.'
          }
        } else {
          done()
        }
      }
    })

    // Retry original and queued requests
    const newToken = localStorage.getItem('token')
    originalConfig.headers.Authorization = `Bearer ${newToken}`
    const originalResponse = await axios(originalConfig)

    // Retry queued requests
    requestQueue.forEach(({ resolve, config }) => {
      config.headers.Authorization = `Bearer ${newToken}`
      resolve(axios(config))
    })
    requestQueue = []
    return originalResponse
  } catch (err) {
    // If user canceled or reauth failed
    requestQueue.forEach(({ reject }) => reject(err))
    requestQueue = []
    throw err
  } finally {
    isRefreshing = false
  }
}
