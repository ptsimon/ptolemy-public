import React, { FC, useEffect, useRef, useState } from 'react'
import BaseWidget, { BaseChildProps } from '../BaseWidget'
import Graph from '../../../libs/Graph'
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks'
import {
  selectGraph,
  selectProjectName,
  setProjectName,
  selectMetadata,
  selectSkeleton,
  TCOMetadata,
} from '../main/MainSlice'
import { ActionCreators } from 'redux-undo'
import { combineIntoCode } from '../code/CodeEditorWidget'
import { onSaveButton } from '../code/TCODatabase'
import { Skeleton } from '../../../core/types'
import { motion, AnimatePresence } from 'framer-motion'


const TitleWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
  const dispatch = useAppDispatch()
  const graph: Graph | undefined = useAppSelector(selectGraph)
  const skeleton: Skeleton | undefined = useAppSelector(selectSkeleton)
  const metadata: TCOMetadata = useAppSelector(selectMetadata)
  const projectName: string = useAppSelector(selectProjectName)
  const combinedJson = combineIntoCode(metadata, projectName, skeleton)

  const [isSaveClicked, setIsSaveClicked] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = projectName
    }
  }, [projectName])

  return (
    <BaseWidget {...props}>
      <input
        className="text-2xl text-gray-3 w-1/2"
        ref={inputRef}
        onChange={(e) => dispatch(setProjectName(e.target.value.trim()))}
      ></input>
      <div className="total-text text-4xl font-medium">
        {graph?.evaluateStr() ?? '(Total Error)'}
      </div>
      <div className="flex flex-col justify-center absolute right-0 bottom-1 p-4 ">
        <AnimatePresence>
          {isSaveClicked && (<motion.div
            className="text-sm text-terracotta"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
          >
            <div>
              Save clicked!
            </div>
          </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-row items-center space-x-2">
          <button
            className="btn-primary"
            onClick={() => {
              onSaveButton(combinedJson)
              setIsSaveClicked(true)
              setTimeout(() => { setIsSaveClicked(false); }, 1000); //sets isSaved to false after 5 seconds
            }}
          >
            Save
          </button>
          <button
            className="btn-primary"
            onClick={() => console.log('Scrolling to TCO Database Widget')}
          >
            <a href="#Code_Editor_Widget">
              Load
            </a>
          </button>
          <div className="font-light"> | </div>
          <div
            onClick={() => dispatch(ActionCreators.undo())}
            className="btn-secondary"
          >
            Undo
          </div>
          <div
            onClick={() => dispatch(ActionCreators.redo())}
            className="btn-secondary"
          >
            Redo
          </div>
        </div>
      </div>
    </BaseWidget>
  )
}

export default TitleWidget
