import React, { FC } from 'react'
import Tree from 'react-d3-tree'
import BaseWidget, { BaseChildProps } from './BaseWidget'
import Graph from '../../libs/Graph'
import Node from '../../libs/Node'

interface Point {
  x: number
  y: number
}

interface ChartNode {
  name: string
  children: ChartNode[]
  attributes: Record<string, string | number | boolean>
}

type Props = {
  graph: Graph | null
}

const appendChartNodes = (
  parentGraph: Graph,
  childNode: Node,
  chart: ChartNode
) => {
  //Create Tree Node
  const newChartNode: ChartNode = {
    name: childNode.key,
    children: [],
    attributes: {
      Cost: '$' + (parentGraph.evaluateNodeStr(childNode) ?? 'error'),
    },
  }

  //If child is detected, create new node per child
  if (childNode.adjacents.length > 0) {
    childNode.adjacents.forEach((node: Node) => {
      appendChartNodes(parentGraph, node, newChartNode)
    })
  }

  //Once all children are resolved, finalize node
  chart.children.push(newChartNode)
}

const createChartObject = (graph: Graph) => {
  // Create Node w/ empty children
  const chart: ChartNode = {
    name: 'TCO',
    children: [],
    attributes: {
      cost: '$' + (graph.evaluateStr() ?? 'error'),
    },
  }

  // For each child detected
  graph.initialNode.adjacents.forEach((childNode: Node) => {
    appendChartNodes(graph, childNode, chart)
  })

  return chart
}

const ChartWidget: FC<BaseChildProps & Props> = (
  props: BaseChildProps & Props
) => {
  if (props.graph === null) {
    //TODO: Add Proper Error if invalid JSON
    return (
      <BaseWidget {...props}>
        <div className="text-center">
          <span color="red">Chart Input is Invalid!</span>
        </div>
      </BaseWidget>
    )
  }
  const chart = createChartObject(props.graph)
  const rootNodePos: Point = {
    x: 500,
    y: 20,
  }
  return (
    <BaseWidget {...props}>
      <Tree data={chart} orientation="vertical" translate={rootNodePos} />
    </BaseWidget>
  )
}

export default ChartWidget
