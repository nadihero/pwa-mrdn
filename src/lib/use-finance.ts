import { useSyncExternalStore } from 'react'
import {
  getServerSnapshot,
  getSnapshot,
  subscribeStore,
} from './store'

export function useFinance() {
  return useSyncExternalStore(subscribeStore, getSnapshot, getServerSnapshot)
}
