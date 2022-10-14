import Graph from '../libs/Graph'
import Node from '../libs/Node'
import * as Sklt from '../libs/Skeleton'
import { Skeleton, SkeletonNode } from './types'

// TODO move to libs/graph?
export const buildGraphFromSkeleton = (skeleton: Skeleton): Graph => {
    const rootNode = Sklt.getRootNode(skeleton)
    const graph = new Graph(new Node(rootNode.id, rootNode.eval, rootNode.units), rootNode.assumptions)

    // Add the rest of the non-root nodes into the graph
    Sklt.getNonRootNodes(skeleton)
        .forEach((node: SkeletonNode) => {
            // TODO Fix later. For now, make a circular reference for orphaned nodes
            const parent = node.parent ?? node.id
            graph.addEdge(parent, new Node(node.id, node.eval, node.units, node.values ?? {}))
        })
    return graph
}
