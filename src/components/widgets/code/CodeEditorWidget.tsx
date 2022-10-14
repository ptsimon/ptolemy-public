import React, { FC } from 'react'
import CodeEditor from '../../CodeEditor'
import BaseWidget, { BaseChildProps } from '../BaseWidget'
import {
  useAppSelector,
  useAppDispatch,
  DispatchType,
} from '../../../core/redux/hooks'
import {
  selectMetadata,
  selectSkeleton,
  setSkeleton,
  TCOMetadata,
  setProjectName,
  selectProjectName,
} from '../main/MainSlice'
import { Skeleton } from '../../../core/types'
import { IEditorInstance } from '@uiw/react-codemirror'
import { setChartLayout, setActiveNode } from '../chart/ChartSlice'
import Autosaves from './Autosaves'
import { TCODatabase } from './TCODatabase'

type Combined = {
  skeleton?: Skeleton
  metadata: TCOMetadata
  projectName: string
}

const onSubmitCodeClick = (code: string, dispatch: DispatchType): void => {
  try {
    const combined: Combined = JSON.parse(code)
    if (combined.skeleton) {
      dispatch(setSkeleton({ sk: combined.skeleton, caller: 'onSubmitCode' }))
    }
    dispatch(setChartLayout(combined.metadata.chart))
    dispatch(setProjectName(combined.projectName))
    dispatch(setActiveNode())
  } catch (err) {
    alert(err)
  }
}

const combineIntoCode = (
  metadata: TCOMetadata,
  projectName: string,
  skeleton?: Skeleton
): string => {
  const combined: Combined = { skeleton, metadata, projectName }
  return JSON.stringify(combined, null, 2)
}

const CodeEditorWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
  const dispatch = useAppDispatch()
  const skeleton: Skeleton | undefined = useAppSelector(selectSkeleton)
  const metadata: TCOMetadata = useAppSelector(selectMetadata)
  const projectName: string = useAppSelector(selectProjectName)
  const combinedJson = combineIntoCode(metadata, projectName, skeleton)

  return (
    <BaseWidget {...props}>
      {/* TODO fix bottom padding... it's a hack */}
      <div className="flex h-full pt-2 pb-20">
        <div className="w-2/5">
          <CodeEditor
            code={combinedJson}
            onSubmit={(instance?: IEditorInstance) =>
              onSubmitCodeClick(instance?.editor.getValue(), dispatch)
            }
            submitText="Set Skeleton & Metadata"
          />
        </div>
        <div className="w-1/5 px-4">
          <Autosaves
            combinedJson={combinedJson}
            setCodeCallback={(code) => onSubmitCodeClick(code, dispatch)}
          />
        </div>
        <div className="w-2/5 pr-4">
          <TCODatabase
            combinedJson={combinedJson}
            setCodeCallback={(code) => onSubmitCodeClick(code, dispatch)}
          />
        </div>
      </div>
    </BaseWidget>
  )
}

export { CodeEditorWidget, combineIntoCode }
