const AUTH_KEY = 'meridian_pin_ok'
export const APP_PIN = '00000'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function loginWithPin(pin: string): boolean {
  if (pin === APP_PIN) {
    sessionStorage.setItem(AUTH_KEY, '1')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY)
}
