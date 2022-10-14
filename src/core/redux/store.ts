import { combineReducers, configureStore } from '@reduxjs/toolkit'
import ChartSlice from '../../components/widgets/chart/ChartSlice'
import MainSlice from '../../components/widgets/main/MainSlice'
import undoable, { includeAction } from 'redux-undo'

const UNDOABLE_OPTIONS = { 
  filter: includeAction([
    "main/setSkeleton",
    "chart/setTemplates",
    "chart/setNodePosition",
  ]) 
}

const store = configureStore({
  reducer: undoable(combineReducers({
    main: MainSlice,
    chart: ChartSlice,
  }), UNDOABLE_OPTIONS),
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch