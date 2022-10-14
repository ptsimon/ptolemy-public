import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { buildGraphFromSkeleton } from '../../../core/CalculationGraph'
import { RootState } from '../../../core/redux/store'
import { Skeleton } from '../../../core/types'
import { modify } from '../../../libs/Misc'
import { traverseSkeleton } from '../../../libs/Skeleton'
import { Template } from '../../../libs/Template'
import { setSkeleton } from '../main/MainSlice'
import { computeNodeDefaultPositions, LayoutState, NodeLayoutState } from './ChartLayout'
import { Popup } from './ChartPopup'
import { Position } from './types'

export type ChartState = {
    layout: LayoutState,
    interaction: {
        activeNode?: {
            id: string
        },
        popup?: Popup,
    },
    templates: Template[] | null,  // if null, templates are not loaded yet
}

export const initialChartState: ChartState = {
    layout: {
        nodes: {},
    },
    interaction: {},
    templates: null,
}

export const chartSlice = createSlice({
    name: 'chart',
    initialState: initialChartState,
    reducers: {
        // Set whole chart state, called when copy-pasting entire state
        setChartLayout: (state, action: PayloadAction<LayoutState>) => {
            state.layout = action.payload
        },
        renameNodeInLayoutState: (state, action: PayloadAction<{ oldId: string, newId: string }>) => {
            const { oldId, newId } = action.payload
            state.layout.nodes[newId] = state.layout.nodes[oldId]
        },
        setNodePosition: (state, action: PayloadAction<{ id: string, position: Position }>) => {
            state.layout.nodes[action.payload.id].position = action.payload.position
        },
        toggleNodeCollapsed: (state, action: PayloadAction<{ nodeId: string, skeleton: Skeleton }>) => {
            const nodeId = action.payload.nodeId
            const currentlyCollapsed = state.layout.nodes[nodeId].isCollapsed
            const basePos = state.layout.nodes[nodeId].position
            traverseSkeleton(action.payload.skeleton, nodeId, (skNode): boolean => {
                if (skNode.id == nodeId) return false  // Self visit
                const child = state.layout.nodes[skNode.id]
                if (!currentlyCollapsed) {
                    // when collapsing, need to replace children's absolute positions with relative positions
                    child.position = { x: child.position.x - basePos.x, y: child.position.y - basePos.y }
                } else {
                    // when expanding, need to return children's relative positions to absolute positions based on new parent position
                    child.position = { x: child.position.x + basePos.x, y: child.position.y + basePos.y }
                }
                return child.isCollapsed  // if child also has collapsed children, do not traverse its children 
            })
            state.layout.nodes[nodeId].isCollapsed = !currentlyCollapsed
        },
        setActiveNode: (state, action: PayloadAction<{ id: string } | undefined>) => {
            state.interaction.activeNode = action.payload
        },
        setPopup: (state, action: PayloadAction<Popup | undefined>) => {
            state.interaction.popup = action.payload
        },
        setTemplates: (state, action: PayloadAction<Template[]>) => {
            state.templates = action.payload
        },
        setSelectedTemplate: (state, action: PayloadAction<Template | undefined>) => {
            if (state.interaction.popup) {
                state.interaction.popup.selectedTemplate = action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setSkeleton, (state, action) => {
                // Keep chart state in sync with skeleton
                const skeleton = action.payload.sk
                const graph = buildGraphFromSkeleton(skeleton)
                const curNodePositions = action.payload.resetLayout ? {} : state.layout.nodes
                const positions = computeNodeDefaultPositions(graph, curNodePositions)
                const curChartNodes: Record<string, NodeLayoutState> = curNodePositions
                const newChartNodes: Record<string, NodeLayoutState> = {}
                skeleton.forEach((sk) => {
                    if (sk.id in curChartNodes) {
                        newChartNodes[sk.id] = curChartNodes[sk.id]
                    } else {
                        // For new nodes not in the current chart state
                        newChartNodes[sk.id] = {
                            position: positions[sk.id],
                            isCollapsed: false,
                        }
                    }
                })
                modify(state.layout.nodes, newChartNodes)
            })
    },
})

// Selectors
export const selectChartLayout = (state: RootState): LayoutState => state.present.chart.layout
export const selectActiveNode = (state: RootState): { id: string } | undefined => state.present.chart.interaction.activeNode
export const selectPopup = (state: RootState): Popup | undefined => state.present.chart.interaction.popup
export const selectTemplates = (state: RootState): Template[] | null => state.present.chart.templates
export const selectSelectedTemplate = (state: RootState): Template | undefined => state.present.chart.interaction.popup?.selectedTemplate
export const selectActiveNodePos = (state: RootState): Position | undefined => {
    const activeNode = state.present.chart.interaction.activeNode
    return (!activeNode) ? undefined : state.present.chart.layout.nodes[activeNode.id].position
}
export const selectActiveNodeLayoutState = (state: RootState): NodeLayoutState | undefined => {
    const activeNode = state.present.chart.interaction.activeNode
    return (!activeNode) ? undefined : state.present.chart.layout.nodes[activeNode.id]
}

// Action creators are generated for each case reducer function
export const { setChartLayout, setNodePosition, setActiveNode, setPopup, toggleNodeCollapsed, setTemplates, setSelectedTemplate, renameNodeInLayoutState } = chartSlice.actions

export default chartSlice.reducer