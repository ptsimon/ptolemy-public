import React, { FC, RefObject } from 'react'
import { useAppSelector } from '../../../core/redux/hooks'
import { selectAssumptions, selectSkeleton } from '../main/MainSlice'
import { Assumptions, Skeleton } from '../../../core/types'
import * as Skl from '../../../libs/Skeleton'
import AceEditor from 'react-ace'
import { Ace } from 'ace-builds'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/ext-language_tools'

export type Props = {
  editorRef: RefObject<AceEditor>
  isDisabled: boolean
  nodeId?: string
  defaultValue?: string
}

const updateAutoComplete = (
  aceEditor: AceEditor | undefined | null,
  assumptions: Assumptions,
  childIds: string[]
) => {
  const staticWordCompleter = {
    getCompletions: function (
      editor: Ace.Editor,
      session: Ace.EditSession,
      position: Ace.Point,
      prefix: string,
      callback: Ace.CompleterCallback
    ) {
      const assumptionCompletions = Object.keys(assumptions).map((word) => ({
        caption: `${word}`,
        value: word,
        meta: `Assumption (value: ${assumptions[word]})`,
        score: 10,
      }))
      const childIdCompletions = childIds.map((id) => ({
        caption: `${id}`,
        value: id,
        meta: 'current child',
        score: 20,
      }))
      callback(null, [...assumptionCompletions, ...childIdCompletions])
    },
  }
  if (aceEditor) {
    aceEditor.editor.completers = [staticWordCompleter]
  }
}

const ChartPopupEditor: FC<Props> = (props: Props) => {
  const skeleton: Skeleton | undefined = useAppSelector(selectSkeleton)
  const curNodeChildren = skeleton
    ? Skl.getChildrenOfNode(skeleton, props.nodeId)
    : []
  const assumptions: Assumptions = useAppSelector(selectAssumptions)

  return (
    <div className={`h-16 ${props.isDisabled ? 'noselection' : ''}`}>
      <AceEditor
        mode="javascript"
        theme="solarized_light"
        name="evalEditor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          showLineNumbers: true,
          showGutter: true,
          highlightGutterLine: false,
          highlightActiveLine: false,
          cursorStyle: 'slim',
          useWorker: false,
        }}
        readOnly={props.isDisabled}
        width={'100'}
        defaultValue={props.defaultValue}
        ref={props.editorRef}
        onFocus={() =>
          updateAutoComplete(
            props.editorRef?.current,
            assumptions,
            curNodeChildren.map((n) => n.id)
          )
        }
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        wrapEnabled={true}
        fontSize={14}
        onLoad={(editorInstance) => {
          editorInstance.container.style.width = '100%'
          editorInstance.container.style.height = '100%'
        }}
        onSelectionChange={
          !props.isDisabled
            ? undefined
            : (a: Ace.Selection) => a.clearSelection()
        }
      />
    </div>
  )
}

export default ChartPopupEditor
