import React, {
  FC,
  RefObject,
  useRef,
  useState,
  ChangeEvent,
  useEffect,
} from 'react'
import {
  useAppSelector,
  useAppDispatch,
  DispatchType,
} from '../../../core/redux/hooks'
import {
  renameNodeInLayoutState,
  selectPopup,
  selectSelectedTemplate,
  setActiveNode,
  setPopup,
} from './ChartSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { selectSkeleton, setSkeleton } from '../main/MainSlice'
import { Skeleton, SkeletonNode } from '../../../core/types'
import * as Skl from '../../../libs/Skeleton'
import clone from 'just-clone'
import { setIntersection, UnexpectedError } from '../../../libs/Misc'
import { buildGraphFromSkeleton } from '../../../core/CalculationGraph'
import {
  checkValidVarName,
  mathParse,
  replaceNodeInExpression,
} from '../../../libs/Math'
import { MathNode } from 'mathjs'
import AceEditor from 'react-ace'
import ChartPopupEditor from './ChartPopupEditor'
import ChartPopupTemplates from './ChartPopupTemplates'
import * as Tmpl from '../../../libs/Template'

export type Popup = {
  type: 'add' | 'edit' | 'remove'
  nodeId?: string
  selectedTemplate?: Tmpl.Template
}

export type UnitsInputProps = {
  units: Unit
  setUnits: (units: Unit) => void
}

export type Props = {
  // This prop is empty
  emptyProp?: unknown
}

export type FormValues = {
  idValue: string
  evalValue: string
}

export type Unit = {
  id: string
  label: string
  format: string
}

const TITLE = {
  add: 'Add New Node',
  edit: 'Edit Node',
  remove: 'Are you sure you want to remove this node?',
}

const UNITS: Array<Unit> = [
  { id: 'unitless', label: 'Unitless', format: '{}' },
  { id: 'gb', label: 'GB', format: '{} GB' },
  { id: 'usd', label: 'USD ($)', format: '${}' },
  { id: 'php', label: 'PHP (₱)', format: '₱{}' },
  { id: 'sgd', label: 'SGD (S$)', format: 'S${}' },
  { id: 'thb', label: 'THB (฿)', format: '฿{}' },
]

const onAddNode = (
  dispatch: DispatchType,
  skeleton: Skeleton,
  newNodeId: string,
  parentNodeId: string,
  template: Tmpl.Template
) => {
  const newSkeleton: Skeleton = clone(skeleton)

  // Name template using new node id
  const namedTemplate = Tmpl.createNamedTemplate(
    template,
    newNodeId,
    parentNodeId
  )
  const subtreeRoot = namedTemplate.subtreeRoot

  // Check for naming conflicts
  const namesToAdd = namedTemplate.namespace
  const currentNames = Skl.getNamespace(skeleton)
  const conflicts = setIntersection(namesToAdd, currentNames)
  if (conflicts.length > 0) {
    throw new Error(
      `Naming conflicts detected: [${conflicts.join(
        ', '
      )}]\nPlease check current nodes and assumptions (especially unsaved changes).`
    )
  }

  // Add subtree into skeleton
  namedTemplate.nodes.forEach((n) => newSkeleton.push(n))

  // Add assumptions
  Skl.setAssumptions(newSkeleton, {
    ...Skl.getAssumptions(newSkeleton),
    ...namedTemplate.newAssumptions,
  })

  // Update formula of parent node in skeleton
  const parentSkNode = Skl.findIdInSkeleton(newSkeleton, parentNodeId)
  if (!parentSkNode)
    throw new Error(`Parent node ID ${parentNodeId} not found in skeleton`)
  parentSkNode.eval = `${subtreeRoot.id} + ${parentSkNode.eval}`

  // Close popup. Take note that because setPopup is ignored in undo/redo, this has to happen before setSkeleton
  dispatch(setPopup(undefined))
  // Set skeleton and active node
  dispatch(setActiveNode({ id: subtreeRoot.id }))
  dispatch(setSkeleton({ sk: newSkeleton, caller: 'onAddNode' }))
}

// TODO move to thunks?
const onRemoveNode = (
  dispatch: DispatchType,
  skeleton: Skeleton,
  nodeId: string
) => {
  let newSkeleton: Skeleton = clone(skeleton)

  // Update formula of parent node in skeleton
  const skNode = Skl.findIdInSkeleton(newSkeleton, nodeId)
  const parentSkNode = Skl.findIdInSkeleton(newSkeleton, skNode?.parent)
  if (!parentSkNode)
    throw new Error(
      `Parent with ID ${skNode?.parent} of Node ${nodeId} not found in skeleton`
    )
  const newParentExp: MathNode = replaceNodeInExpression(
    mathParse(parentSkNode.eval),
    nodeId,
    '0'
  )
  parentSkNode.eval = newParentExp.toString()

  // Remove node from skeleton
  newSkeleton = Skl.removeIdFromSkeleton(newSkeleton, nodeId)

  // Close popup. Take note that because setPopup is ignored in undo/redo, this has to happen before setSkeleton
  dispatch(setPopup(undefined))
  dispatch(setActiveNode(undefined))
  dispatch(setSkeleton({ sk: newSkeleton, caller: 'onRemoveNode' }))
}

// TODO move to thunks?
const onEditNode = (
  dispatch: DispatchType,
  id: string,
  newNode: SkeletonNode,
  skeleton: Skeleton,
  units: Unit
) => {
  let newSkeleton = clone(skeleton)
  // Rename node in skeleton if new ID
  if (id != newNode.id)
    newSkeleton = Skl.renameNodeInSkeleton(newSkeleton, id, newNode.id)
  // Change eval of renamed node
  newSkeleton = Skl.changeNodeEvalInSkeleton(
    newSkeleton,
    newNode.id,
    newNode.eval
  )
  newSkeleton = Skl.changeNodeUnitsInSkeleton(newSkeleton, newNode.id, units)
  // Build graph and check if any errors
  buildGraphFromSkeleton(newSkeleton).evaluate()
  // Rename node in chart state if new ID (must be before setSkeleton)
  if (id != newNode.id)
    dispatch(renameNodeInLayoutState({ oldId: id, newId: newNode.id }))
  // Close popup. Take note that this has to happen *before* setSkeleton because setPopup is ignored in undo/redo
  dispatch(setPopup(undefined))
  // Set active node to new ID for renamed cases
  dispatch(setActiveNode({ id: newNode.id }))
  // Set new skeleton
  dispatch(setSkeleton({ sk: newSkeleton, caller: 'onEditNode' }))
}

const onConfirmClick = (
  values: FormValues,
  dispatch: DispatchType,
  units: Unit,
  curNode?: SkeletonNode,
  popup?: Popup,
  skeleton?: Skeleton,
  template?: Tmpl.Template
) => {
  if (!popup) return
  try {
    if (!curNode) throw new UnexpectedError('Current node is null!')
    if (!skeleton) throw new UnexpectedError('Skeleton is null!')
    if (!values.idValue) throw new Error('ID should have a value')
    if (!values.evalValue) throw new Error('Expression should have a value')
    if (!checkValidVarName(values.idValue))
      throw new Error(
        `ID must not be numeric nor contain a period (currently "${values.idValue}")`
      )
    const newNode: SkeletonNode = clone(curNode)
    // Replace spaces with underscore
    newNode.id = values.idValue.replace(/ /g, '_')
    newNode.eval = values.evalValue
    if (popup.type === 'add') {
      if (!template) throw new Error('No template selected!')
      onAddNode(dispatch, skeleton, newNode.id, curNode.id, template)
    } else if (popup.type === 'edit') {
      onEditNode(dispatch, curNode.id, newNode, skeleton, units)
    } else if (popup.type === 'remove') {
      onRemoveNode(dispatch, skeleton, newNode.id)
    }
  } catch (e) {
    console.log(e)
    alert('[💾 Error Saving Node]\n' + e)
  }
}

const cleanEvalString = (str: string): string => {
  return str.replace(/[\r\n]+/g, ' ').replace(/\s\s+/g, ' ')
}

const UnitsInput: FC<UnitsInputProps> = (props: UnitsInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const unitsOptions = [...UNITS, { id: 'other', label: 'Other', format: '' }]
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const unitSelected = unitsOptions.find((u) => u.id == e.target.value)
    if (!unitSelected) {
      alert(`Unexpected error: ${e.target.value} not found in units`)
    } else {
      props.setUnits(unitSelected)
    }
  }
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let pattern = e.target.value
    // TODO: make this better, properly check if input value is a pattern
    if (pattern.indexOf('{') == -1) {
      pattern = '{} ' + pattern
    }
    props.setUnits({ id: 'other', label: 'Other', format: pattern })
  }
  useEffect(() => {
    if (selectRef.current) selectRef.current.value = props.units.id
    if (inputRef.current) inputRef.current.value = props.units.format
  }, [props.units])
  return (
    <>
      <div className="text-sm text-gray-4 tracking-wider mt-2 mb-0.5 select-none cursor-default">
        UNITS
      </div>
      <div className="flex">
        <select
          className="flex-1 border border-gray-4 rounded"
          onChange={onSelectChange}
          ref={selectRef}
        >
          {unitsOptions.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.label}
            </option>
          ))}
        </select>
        {props.units.id == 'other' && (
          <input
            name="nodeId"
            className="flex-0 w-32 border-b border-gray-3 mx-2 pl-1"
            placeholder="write unit here"
            onChange={onInputChange}
            ref={inputRef}
          />
        )}
      </div>
    </>
  )
}

const getUnitsFromString = (str: string | undefined): Unit => {
  if (!str) return UNITS[0]
  const defaultUnits = { id: 'other', label: 'Other', format: str }
  return UNITS.find((u) => u.format == str) ?? defaultUnits
}

const ChartPopup: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const popup: Popup | undefined = useAppSelector(selectPopup)
  const skeleton: Skeleton | undefined = useAppSelector(selectSkeleton)
  const curNode = skeleton
    ? Skl.findIdInSkeleton(skeleton, popup?.nodeId)
    : undefined
  const inputId: RefObject<HTMLInputElement> = useRef(null)
  const inputEval: RefObject<AceEditor> = useRef(null)
  const template: Tmpl.Template | undefined = useAppSelector(
    selectSelectedTemplate
  )
  const [units, setUnits] = useState<Unit>(getUnitsFromString(curNode?.units))

  const isIdFieldDisabled =
    popup?.type === 'remove' ||
    (popup?.type === 'edit' && Skl.isRootNode(curNode))
  const isEvalFieldDisabled = popup?.type === 'remove' || popup?.type === 'add'
  const isTemplateSectionShown = popup?.type === 'add'
  const expressionTitle =
    popup?.type === 'add' ? 'TEMPLATE EXPRESSION' : 'EXPRESSION'
  const isUnitsFieldShown = popup?.type === 'edit'

  useEffect(() => {
    setUnits(getUnitsFromString(curNode?.units))
  }, [popup?.nodeId])

  const getFormValues = (): FormValues => ({
    idValue: inputId.current?.value.trim() ?? '',
    evalValue: cleanEvalString(inputEval.current?.editor.getValue() ?? ''),
  })

  return (
    <>
      <AnimatePresence>
        {popup && (
          <motion.div
            key="popup"
            className="popup absolute z-20 w-full h-full px-8 py-4 bg-whitetranslucent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="w-3/4 max-h-full mx-auto p-4 bg-white rounded-lg shadow-md overflow-auto flex flex-col">
              <div className="text-xl text-center font-bold">
                {TITLE[popup.type]}
              </div>
              <div className="flex">
                <div className="flex-1">
                  {/* Node ID */}
                  <div className="text-sm text-gray-4 tracking-wider mt-2 select-none cursor-default">
                    {popup?.type == 'add' && 'NEW'} NODE ID
                  </div>
                  <input
                    name="nodeId"
                    className="w-full border-b border-gray-3 pl-0.5"
                    defaultValue={popup?.type != 'add' ? curNode?.id : ''}
                    autoFocus={true}
                    disabled={isIdFieldDisabled}
                    ref={inputId}
                  />
                </div>
                {isUnitsFieldShown && (
                  <div className="flex-0 w-60 pl-4">
                    {/* Units */}
                    <UnitsInput units={units} setUnits={setUnits} />
                  </div>
                )}
              </div>

              {/* Templates */}
              {isTemplateSectionShown && (
                <ChartPopupTemplates
                  onClick={(template) =>
                    inputEval.current?.editor.setValue(
                      Tmpl.getRoot(template)?.eval ??
                      '# 👆 Select a template above'
                    )
                  }
                />
              )}

              {/* Expression */}
              <div className="text-sm text-gray-4 tracking-wider mb-1 mt-2 select-none cursor-default">
                {expressionTitle}
              </div>
              {isEvalFieldDisabled ? (
                <div className="text-xs text-gray-4 mb-1 italic">
                  The text box below is read-only.
                </div>
              ) : (
                <div className="text-xs text-gray-4 mb-2">
                  💡 <b className="text-gray-2">Ctrl+Space</b> for auto-complete
                  <br />❓ For syntax help: see the{' '}
                  <a
                    href="https://mathjs.org/docs/expressions/syntax.html#operators"
                    className="text-accent-0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    mathjs syntax here
                  </a>
                </div>
              )}
              <ChartPopupEditor
                isDisabled={isEvalFieldDisabled}
                editorRef={inputEval}
                nodeId={popup?.nodeId}
                defaultValue={popup?.type === 'add' ? '' : curNode?.eval}
              />

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* buttons */}
              <div className="popup-btns text-right mt-3">
                <button
                  className="btn-primary"
                  onClick={() =>
                    onConfirmClick(
                      getFormValues(),
                      dispatch,
                      units,
                      curNode,
                      popup,
                      skeleton,
                      template
                    )
                  }
                >
                  Confirm
                </button>
                <button
                  className="btn-secondary ml-2"
                  onClick={() => dispatch(setPopup(undefined))}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChartPopup
