import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'


// Use these throughout your app instead of plain `useDispatch` and `useSelector`

// Insane return type for useAppDispatch, no way I'm adding the return type here
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type DispatchType = ReturnType<typeof useAppDispatch>
