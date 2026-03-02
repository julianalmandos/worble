/* eslint-disable @typescript-eslint/no-explicit-any */
import { EffectScope, effectScope, onScopeDispose } from 'vue'

export const createSharedComposable = (composable: () => any) => {
  let subscribers = 0
  let state: any = null
  let scope: EffectScope | null = null

  const dispose = () => {
    if (scope && --subscribers <= 0) {
      scope.stop()
      state = scope = null
    }
  }

  return (...args: unknown[]) => {
    subscribers++
    if (!state) {
      scope = effectScope(true)
      state = scope.run(() => composable(...(args as Parameters<typeof composable>)))
    }
    onScopeDispose(dispose)
    return state
  }
}
