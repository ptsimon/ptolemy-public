import Node from '../../../libs/Node'
import Graph from '../../../libs/Graph'
import { Position } from './types'
import { doRectsCollide } from '../../../libs/Misc'
import { getNearestMultiple } from '../../../libs/Math'

export type NodeLayoutState = {
    position: Position,
    isCollapsed: boolean,  // a node is collapsed if its children is hidden
}

export type LayoutState = {
    nodes: NodePoss
}

export type NodePoss = Record<string, NodeLayoutState>

const GRID_SIZE = 16
const RECT_DIMS = { x: 128, y: 64 }
const ROOT_INIT_X = 350
const ROOT_INIT_Y = 50
const CHILD_POS_XLIM = 5
const CHILD_POS_YLIM = 4

const checkNodesCollision = (rectA: Position, rectB: Position, rectDims: Position): boolean => {
    const dims = { width: rectDims.x, height: rectDims.y }
    return doRectsCollide({ ...rectA, ...dims }, { ...rectB, ...dims })
}

const checkIfCollides = (id: string, rect: Position, nodes: NodePoss, rectDims: Position) => {
    return Object
        .entries(nodes)
        .filter(([key]) => key != id)
        .some(([, pos]) => checkNodesCollision(rect, pos.position, rectDims))
}

const computeDefaultPosition = (result: Record<string, Position>, nodeId: string, nodes: NodePoss, parentPos?: Position): Position => {
    if (!parentPos) {
        return {
            x: getNearestMultiple(ROOT_INIT_X, GRID_SIZE),
            y: getNearestMultiple(ROOT_INIT_Y, GRID_SIZE),
        }
    }
    // Yeah I know... combine layout state (which is unmodified) with the result (modified) so that grid search can take into account just-added nodes
    const resultLS = Object
        .entries(result)
        .map(([key, val]) => ([key, { position: val, isCollapsed: false }]))
    const combinedLayout = { ...nodes, ...Object.fromEntries(resultLS) }

    // Grid search for possible locations
    const gapX = RECT_DIMS.x + GRID_SIZE
    const gapY = RECT_DIMS.y + GRID_SIZE * 2
    for (let y = 1; y <= CHILD_POS_YLIM; y++) {  // y-coord ("Depth") below parent
        for (let ctr_x = 0; ctr_x <= CHILD_POS_XLIM; ctr_x++) {  // x-coord relative to parent (left and right)
            const x = Math.ceil(ctr_x / 2) * ((ctr_x % 2 === 0) ? -1 : 1)
            const possiblePos = {
                x: parentPos.x + x * gapX,
                y: parentPos.y + y * gapY,
            }
            if (!checkIfCollides(nodeId, possiblePos, combinedLayout, RECT_DIMS)) {
                return possiblePos
            }
        }
    }
    // If grid search fails, just give up (lol)
    return {
        x: parentPos.x + GRID_SIZE,
        y: parentPos.y + GRID_SIZE,
    }
}

const computeNodePosition = (result: Record<string, Position>, graph: Graph, nodes: NodePoss, curNode: Node, parentPos?: Position,): void => {
    const curPos: Position = nodes[curNode.key]?.position
        ?? computeDefaultPosition(result, curNode.key, nodes, parentPos)
    // Assign to result
    result[curNode.key] = curPos
    // Go through children
    const nextLevelLength = curNode.adjacents.length
    if (nextLevelLength > 0) {
        curNode.adjacents.forEach((childNode: Node) => {
            computeNodePosition(result, graph, nodes, childNode, curPos)
        })
    }
}

export const computeNodeDefaultPositions = (graph: Graph, nodes: NodePoss): Record<string, Position> => {
    // TODO possibly add support for multiple roots
    const result: Record<string, Position> = {}
    computeNodePosition(result, graph, nodes, graph.initialNode)
    return result
}
