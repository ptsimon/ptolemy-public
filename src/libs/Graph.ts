import { Assumptions } from '../core/types'
import { getValueDisplayString } from './Math'
import Node from './Node'

class Graph {
  nodes: Map<string, Node>
  initialNode: Node
  assumptions: Assumptions

  constructor(initialNode: Node, assumptions = {}) {
    this.nodes = new Map()
    this.assumptions = assumptions
    this.initialNode = initialNode
    this.nodes.set(this.initialNode.key, this.initialNode)
  }

  addEdge(sourceKey: string, destinationNode: Node): Node {
    const sourceNode = this.nodes.get(sourceKey)

    if (sourceNode === undefined) {
      throw new Error(`Source key: ${sourceKey} is not in list of nodes`)
    } else {
      sourceNode.adjacents.push(destinationNode)
      destinationNode.parent = sourceNode
    }

    this.nodes.set(destinationNode.key, destinationNode)

    return destinationNode
  }

  evaluate(): number | null {
    return this.evaluateNode(this.initialNode)
  }

  evaluateStr(): string | null {
    return this.evaluateNodeStr(this.initialNode)
  }

  evaluateNodeStr(node: Node): string | null {
    return getValueDisplayString(this.evaluateNode(node), node.units)
  }

  evaluateNode(node: Node): number | null {
    // We expect broken evaluate() states in the course of editing the graph,
    // so we return null instead of throwing an error
    try {
      let allParams: Record<string, unknown> = {...this.assumptions}
      allParams = node.adjacents.reduce((params, adj) => {
        return { ...params, [adj.key]: this.evaluateNode(adj) }
      }, allParams)
      return node.expression.evaluate(allParams)
    } catch (error) {
      return null
    }
  }
}

export default Graph
