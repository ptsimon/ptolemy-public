import React, { FC, useRef } from 'react'
import CodeMirror, {
  Editor,
  IReactCodemirror,
  IEditorInstance,
} from '@uiw/react-codemirror'
import 'codemirror/theme/idea.css'

export type CodeEditorProps = {
  code: string
  onChange?: (instance: Editor, change: IReactCodemirror) => void
  onSubmit?: (instance?: IEditorInstance) => void
  submitText?: string
}

const CodeEditor: FC<CodeEditorProps> = (props: CodeEditorProps) => {
  const codeEl = useRef<IEditorInstance>(null)
  return (
    <div className="flex-0 flex-col h-full">
      <CodeMirror
        ref={codeEl}
        value={props.code}
        options={{
          theme: 'idea',
          mode: 'javascript',
          lineNumbers: true,
        }}
        onChange={(instance: Editor, change: IReactCodemirror) => {
          if (!props.onChange) return
          props.onChange(instance, change)
        }}
      />
      <div className="flex mt-1 code-editor">
        <button
          onClick={() =>
            props.onSubmit && props.onSubmit(codeEl.current ?? undefined)
          }
          className="btn-primary flex-1 mr-1"
        >
          {props.submitText ?? 'Apply Changes'}
        </button>
        <button
          onClick={() => codeEl.current?.editor.setValue('')}
          className="btn-secondary flex-0 w-24"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default CodeEditor
