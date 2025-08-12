export function hasPermission(permission) {
  try {
    const perms = JSON.parse(localStorage.getItem('permissions')) || []
    return perms.includes('*') || perms.includes(permission)
  } catch (e) {
    console.log('Permissions Error: ',e)
    return false
  }
}
