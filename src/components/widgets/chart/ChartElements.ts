import Node from '../../../libs/Node'
import Graph from '../../../libs/Graph'
import { NodeCallbacks, Elements, Element, Edge, Position, NodeData } from './types'
import { LayoutState } from './ChartLayout'


const visitNode = (graph: Graph, curNode: Node, callbacks: NodeCallbacks, layoutState: LayoutState, parentElement?: Element): Elements => {
    const elements: Elements = []
    if (!layoutState.nodes[curNode.key]) {
        console.log(layoutState.nodes)
        throw new Error(`Key ${curNode.key} is not in layout state. See console logs for more details.`)
    }
    const position: Position = layoutState.nodes[curNode.key].position

    // Create Element
    const name = curNode.key
    const nodeData: NodeData = {
        label: name,
        cost: graph.evaluateNode(curNode),
        callbacks,
        id: name,
        parentId: parentElement?.id,
        numChildren: curNode.adjacents.length,
        isCollapsed: layoutState.nodes[curNode.key].isCollapsed,
        units: curNode.units,
    }
    const curElement: Element = {
        id: name,
        type: 'special',
        data: nodeData,
        position,
    }
    elements.push(curElement)

    // Create Edge from parent to current element
    if (parentElement) {
        const edge: Edge = {
            id: curElement.id + "-" + parentElement.id,
            source: parentElement.id,
            target: curElement.id,
        }
        elements.push(edge)
    }

    // If child is detected, create new node per child
    const nextLevelLength = curNode.adjacents.length
    if (nextLevelLength > 0 && !nodeData.isCollapsed) {
        curNode.adjacents.forEach((childNode: Node) => {
            const childElements: Elements = visitNode(graph, childNode, callbacks, layoutState, curElement)
            elements.push(...childElements)
        })
    }

    return elements
}

export const createChartElements = (graph: Graph, callbacks: NodeCallbacks, layoutState: LayoutState): Elements => {
    // TODO possibly add support for multiple roots
    return visitNode(graph, graph.initialNode, callbacks, layoutState)
}
