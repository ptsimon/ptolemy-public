import React, { FC, RefObject, useRef } from 'react'
import { FlowTransform } from 'react-flow-renderer'
import { Position } from './types'
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks'
import {
  selectActiveNode,
  selectActiveNodeLayoutState,
  setPopup,
} from './ChartSlice'
import {
  ViewGridAddIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/outline'
import * as Skl from '../../../libs/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { NodeLayoutState } from './ChartLayout'

export type Props = {
  containerRef: RefObject<HTMLDivElement>
  chartZoomPan?: FlowTransform
}

const calculateBarCoords = (
  props: Props,
  barBG: RefObject<HTMLDivElement>,
  activeNodePos?: Position
): { top: number; left: number } => {
  const zoomPan = props.chartZoomPan ?? { x: 0, y: 0, zoom: 1 }
  const contHeight = props.containerRef.current?.clientHeight ?? 0
  const contWidth = props.containerRef.current?.clientWidth ?? 0
  const barWidth = barBG.current?.clientWidth ?? 256
  const barHeight = barBG.current?.clientHeight ?? 0
  const nodeX = activeNodePos?.x ?? 0
  const nodeY = activeNodePos?.y ?? 0

  const top = Math.min(
    Math.max(zoomPan.y + nodeY * zoomPan.zoom - 44, 4),
    contHeight - barHeight - 8
  )
  const left = Math.min(
    Math.max(zoomPan.x + (nodeX + 64) * zoomPan.zoom - barWidth / 2, 44),
    contWidth - barWidth - 8
  )
  return { top, left }
}

const ChartToolbar: FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch()
  const activeNode: { id: string } | undefined =
    useAppSelector(selectActiveNode)
  const activeNodeLayout: NodeLayoutState | undefined = useAppSelector(
    selectActiveNodeLayoutState
  )

  const barBG: RefObject<HTMLDivElement> = useRef(null)

  const barCoords = calculateBarCoords(props, barBG, activeNodeLayout?.position)
  const isDeleteEnabled = !Skl.isRootNode(activeNode?.id)
  const isAddEnabled = !activeNodeLayout?.isCollapsed

  return (
    <>
      <AnimatePresence>
        {activeNode && (
          <motion.div
            key="toolbar"
            className="absolute z-10"
            initial={{ y: 10, opacity: 0, ...barCoords }}
            animate={{ y: 0, opacity: 1, ...barCoords }}
            exit={{ y: 5, opacity: 0 }}
          >
            <div
              className="flex flex-row bg-gray-2 rounded-md w-64 h-8 p-1 shadow shadow-md"
              ref={barBG}
            >
              {/* TODO refactor classNames (esp disabling which is very repetitive) */}
              <ViewGridAddIcon
                className={`toolbarAdd h-6 w-6 p-0.5 ${
                  isAddEnabled
                    ? 'text-gray-6 active:text-white hover:text-accent-0 cursor-pointer'
                    : 'text-gray-3 cursor-default'
                }`}
                onClick={() =>
                  isAddEnabled &&
                  dispatch(setPopup({ type: 'add', nodeId: activeNode?.id }))
                }
              />
              <PencilIcon
                className={`toolbarEdit h-6 w-6 p-0.5 text-gray-6 active:text-white hover:text-accent-0 cursor-pointer`}
                onClick={() =>
                  dispatch(setPopup({ type: 'edit', nodeId: activeNode?.id }))
                }
              />
              <TrashIcon
                className={`toolbarRemove h-6 w-6 p-0.5 ${
                  isDeleteEnabled
                    ? 'text-gray-6 active:text-white hover:text-accent-0 cursor-pointer'
                    : 'text-gray-3 cursor-default'
                }`}
                onClick={() =>
                  isDeleteEnabled &&
                  dispatch(setPopup({ type: 'remove', nodeId: activeNode?.id }))
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChartToolbar
