import React, { FC, useCallback } from 'react'
import { Handle, Position } from 'react-flow-renderer'
import { NodeData } from './types'
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks'
import {
  selectActiveNode,
  setActiveNode,
  toggleNodeCollapsed,
} from './ChartSlice'
import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
} from '@heroicons/react/outline'
import { selectSkeleton } from '../main/MainSlice'
import { motion } from 'framer-motion'
import { getValueDisplayString } from '../../../libs/Math'

type Props = {
  data: NodeData
}

type CollapseButtonProps = {
  nodeId: string
  isCollapsed: boolean
}

const BOTTOM_HANDLE_COLLAPSED_STYLE = {
  backgroundColor: '#ef4631',
  borderRadius: 0,
}
const BOTTOM_HANDLE_NO_CHILDREN_STYLE = { opacity: 0 }

export const MainChartNode: FC<Props> = (data: Props) => {
  const nodeId = data.data.id
  const callbacks = data.data.callbacks
  const isActiveNode = useAppSelector(selectActiveNode)?.id == nodeId
  const bottomHandleStyle = data.data.isCollapsed
    ? BOTTOM_HANDLE_COLLAPSED_STYLE
    : data.data.numChildren == 0
    ? BOTTOM_HANDLE_NO_CHILDREN_STYLE
    : undefined

  return (
    <motion.div
      key={`chartNode_${data.data.id}`}
      className={`${
        isActiveNode ? 'border-accent-0' : 'border-gray-5'
      } bg-gray-6 border shadow-md p-2 w-32 h-16 rounded-lg cursor-pointer`}
      onClick={(e) => callbacks.onNodeClick(e, data.data)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {data.data.parentId && <Handle type="target" position={Position.Top} />}
      <div className="truncate font-medium">{data.data.label}</div>
      <div className="flex">
        <div className="text-sm flex-1">
          {getValueDisplayString(data.data.cost, data.data.units)}
        </div>
        {data.data.numChildren > 0 && (
          <CollapseButton nodeId={nodeId} isCollapsed={data.data.isCollapsed} />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={bottomHandleStyle}
      />
    </motion.div>
  )
}

export const CollapseButton: FC<CollapseButtonProps> = (
  props: CollapseButtonProps
) => {
  const dispatch = useAppDispatch()
  const skeleton = useAppSelector(selectSkeleton)

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!skeleton) return
      e.stopPropagation()
      dispatch(toggleNodeCollapsed({ nodeId: props.nodeId, skeleton }))
      dispatch(setActiveNode(undefined))
    },
    [props.nodeId, skeleton]
  )

  const btnProps = {
    className: `h-4 w-4 mt-1 ${
      props.isCollapsed ? 'text-white bg-accent-0' : 'text-gray-3 bg-gray-5'
    } rounded p-0.5 active:text-white active:bg-gray-5 hover:text-white hover:bg-accent-0 cursor-pointer`,
    onClick,
  }

  if (props.isCollapsed) {
    return <ChevronDoubleDownIcon {...btnProps} />
  } else {
    return <ChevronDoubleUpIcon {...btnProps} />
  }
}
