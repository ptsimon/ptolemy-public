import React, { FC } from 'react'
import BaseWidget, { BaseChildProps } from '../BaseWidget'
import Graph from '../../../libs/Graph'
import Node from '../../../libs/Node'
import { useAppSelector } from '../../../core/redux/hooks'
import { selectGraph } from '../main/MainSlice'

interface ChartNode {
  name: string
  children: ChartNode[]
  attributes: Record<string, string | number | boolean>
  depth: number
}

const appendChartNodes = (
  parentGraph: Graph,
  childNode: Node,
  chart: ChartNode,
  list: ChartNode[],
  depth: number
) => {
  //Create Tree Node
  const newChartNode: ChartNode = {
    name: childNode.key,
    children: [],
    attributes: {
      cost: parentGraph.evaluateNodeStr(childNode) ?? 'err',
    },
    depth,
  }

  //If child is detected, create new node per child
  if (childNode.adjacents.length > 0) {
    childNode.adjacents.forEach((node: Node) => {
      appendChartNodes(parentGraph, node, newChartNode, list, depth + 1)
    })
  }

  //Once all children are resolved, finalize node
  chart.children.push(newChartNode)
  list.push(newChartNode)
}

const createChartObject = (graph: Graph) => {
  // Create Node w/ empty children
  const chart: ChartNode = {
    name: 'TCO',
    children: [],
    attributes: {
      cost: graph.evaluateStr() ?? 'error',
    },
    depth: 0,
  }
  const list: ChartNode[] = []
  // For each child detected
  graph.initialNode.adjacents.forEach((childNode: Node) => {
    appendChartNodes(graph, childNode, chart, list, 1)
  })

  list.push(chart)

  return list
}

const BreakdownWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
  const graph: Graph | undefined = useAppSelector(selectGraph)

  if (!graph) {
    //TODO: Add Proper Error if invalid JSON
    return (
      <BaseWidget {...props}>
        <div className="text-center">
          <span color="red">Chart Input is Invalid!</span>
        </div>
      </BaseWidget>
    )
  }
  const list = createChartObject(graph).reverse().splice(1)

  return (
    <BaseWidget {...props}>
      <table className=" mt-5 table-auto border-collapse">
        <thead>
          <tr className="bg-gray-1 text-gray-6">
            <th className="p-2 border border-gray-4">Component</th>
            <th className="p-2 border border-gray-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {list.map((node, index) => (
            <tr key={index}>
              <td className={'border border-gray-4 pl-2'}>
                {'\u2800'.repeat((node.depth - 1) * 2)}
                {node.name}
              </td>
              <td className="p-2 border border-gray-4 text-right">
                {node.attributes.cost}
              </td>
            </tr>
          ))}
          <tr>
            <td className="p-2 border border-gray-4 font-bold">Total Cost</td>
            <td className="p-2 border border-gray-4 text-right font-bold">
              {graph.evaluateStr() ?? 'error'}
            </td>
          </tr>
        </tbody>
      </table>
    </BaseWidget>
  )
}

export default BreakdownWidget
