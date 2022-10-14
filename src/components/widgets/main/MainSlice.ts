import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { buildGraphFromSkeleton } from '../../../core/CalculationGraph'
import { RootState } from '../../../core/redux/store'
import { Assumptions, Skeleton } from '../../../core/types'
import { getAssumptions } from '../../../libs/Skeleton'
import { LayoutState } from '../chart/ChartLayout'

type MainState = {
    skeleton?: Skeleton,
    projectName: string,
}

export type TCOMetadata = {
    chart: LayoutState
} 

const initialState: MainState = {
    skeleton: undefined,
    projectName: "Enter Project Title Here",
}

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setSkeleton: (state, action: PayloadAction<{sk: Skeleton, caller: string, resetLayout?: boolean}>) => {
            const {sk} = action.payload
            state.skeleton = sk
        },
        setProjectName: (state, action: PayloadAction<string>) => {
            state.projectName = action.payload
        },
    },
})

// Selectors
export const selectSkeleton = (state: RootState): Skeleton | undefined => state.present.main.skeleton
export const selectProjectName = (state: RootState): string => state.present.main.projectName
export const selectGraph = createSelector([selectSkeleton], (skeleton) => {
    return skeleton ? buildGraphFromSkeleton(skeleton) : undefined
})
export const selectMetadata = (state: RootState): TCOMetadata => ({
    chart: state.present.chart.layout
})
export const selectAssumptions = (state: RootState): Assumptions => getAssumptions(state.present.main.skeleton)

// Action creators are generated for each case reducer function
export const { setSkeleton, setProjectName } = mainSlice.actions

export default mainSlice.reducer