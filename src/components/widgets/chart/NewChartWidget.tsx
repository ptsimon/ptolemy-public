import React, { FC, useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  FlowTransform,
  Node,
} from 'react-flow-renderer'
import BaseWidget, { BaseChildProps } from '../BaseWidget'
import * as ChartLayout from './ChartLayout'
import { MainChartNode } from './ChartNode'
import { NodeCallbacks, NodeData } from './types'
import {
  DispatchType,
  useAppDispatch,
  useAppSelector,
} from '../../../core/redux/hooks'
import { selectGraph, selectSkeleton, setSkeleton } from '../main/MainSlice'
import {
  selectChartLayout,
  setActiveNode,
  setNodePosition,
  setPopup,
} from './ChartSlice'
import { createChartElements } from './ChartElements'
import ChartToolbar from './ChartToolbar'
import ChartPopup from './ChartPopup'
import { LightningBoltIcon, TrashIcon } from '@heroicons/react/solid'
import { Constants } from '../../../pages/ConstantDefinitions'

export type ChartMetadata = {
  layoutState?: ChartLayout.LayoutState
}

const NODE_TYPES = {
  special: MainChartNode,
}

const onNodeDragStop = (node: Node<NodeData>, dispatch: DispatchType) => {
  dispatch(setNodePosition({ id: node.id, position: node.position }))
}

const NewChartWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
  const dispatch = useAppDispatch()
  const skeleton = useAppSelector(selectSkeleton)
  const graph = useAppSelector(selectGraph)
  const layout: ChartLayout.LayoutState = useAppSelector(selectChartLayout)

  const nodeCallbacks: NodeCallbacks = {
    onNodeClick: useCallback(
      (e, node) => {
        dispatch(setActiveNode({ id: node.id }))
      },
      [layout]
    ),
  }

  const chartContainer = useRef<HTMLDivElement>(null)
  const [zoomPan, setZoomPan] = useState<FlowTransform>({ x: 0, y: 0, zoom: 1 })

  return (
    <BaseWidget {...props}>
      {/* TODO refactor height 1000 */}
      <div className="relative" style={{ height: 1000 }} ref={chartContainer}>
        <ChartToolbar containerRef={chartContainer} chartZoomPan={zoomPan} />
        <ChartPopup />
        {!graph ? (
          <div>JSON broken!</div>
        ) : (
          <>
            <ReactFlow
              elements={createChartElements(graph, nodeCallbacks, layout)}
              nodeTypes={NODE_TYPES}
              onNodeDragStop={(e, node: Node<NodeData>) =>
                onNodeDragStop(node, dispatch)
              }
              onNodeDoubleClick={(e, node: Node<NodeData>) =>
                dispatch(setPopup({ type: 'edit', nodeId: node.id }))
              }
              paneMoveable={true}
              panOnScroll={true}
              snapToGrid={true}
              snapGrid={[16, 16]}
              onMove={(f) => f && setZoomPan(f)}
              onPaneClick={() => dispatch(setActiveNode(undefined))}
              zoomOnDoubleClick={false}
              nodesConnectable={false}
            >
              <Background variant={BackgroundVariant.Dots} gap={16} />
              <Controls>
                <ControlButton
                  onClick={() => {
                    if (!skeleton) return
                    dispatch(setActiveNode(undefined))
                    dispatch(
                      setSkeleton({
                        sk: skeleton,
                        caller: 'resetLayout',
                        resetLayout: true,
                      })
                    )
                  }}
                >
                  <LightningBoltIcon />
                </ControlButton>
                <ControlButton
                  onClick={() => {
                    if (!skeleton) return
                    dispatch(setActiveNode(undefined))
                    dispatch(
                      setSkeleton({
                        sk: Constants.EMPTY,
                        caller: 'deleteAll',
                        resetLayout: true,
                      })
                    )
                  }}
                >
                  <TrashIcon className="text-accent-0" />
                </ControlButton>
              </Controls>
            </ReactFlow>
          </>
        )}
      </div>
    </BaseWidget>
  )
}

export default NewChartWidget
