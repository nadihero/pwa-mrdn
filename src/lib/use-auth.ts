import { useSyncExternalStore } from 'react'
import {
  getAuthServerSnapshot,
  getAuthSnapshot,
  subscribeAuth,
} from './auth'

export function useAuth() {
  return useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  )
}
