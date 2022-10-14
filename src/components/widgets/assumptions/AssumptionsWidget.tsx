import React, { FC, useState, useEffect } from 'react'
import clone from 'just-clone'
import equal from 'deep-equal'
import BaseWidget, { BaseChildProps } from '../BaseWidget'
import * as Sklt from '../../../libs/Skeleton'
import { Assumptions, Skeleton } from '../../../core/types'
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks'
import { selectSkeleton, setSkeleton } from '../main/MainSlice'

type AssumptionForm = {
  name: string
  value: string // string to better mirror textbox value
}

const convertAssumptionsToForm = (
  assumptions: Assumptions
): AssumptionForm[] => {
  return Object.entries(assumptions).map(([key, value]) => ({
    name: key,
    value: value + '',
  }))
}

const convertFormToAssumptions = (
  formValues: AssumptionForm[]
): Assumptions => {
  const assumptions: Assumptions = {}
  for (const v of Object.values(formValues)) {
    const parsed: number = parseFloat(v['value'])
    if (isNaN(parsed)) {
      throw Error(
        `Value for assumption "${v['name']}" is not numeric: "${v['value']}"`
      )
    }
    // Replace spaces with underscore
    assumptions[v['name'].replace(/ /g, '_')] = parsed
  }
  return assumptions
}

const AssumptionsWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
  const dispatch = useAppDispatch()
  const skeleton: Skeleton | undefined = useAppSelector(selectSkeleton)

  const assumptionsFromProps = Sklt.getAssumptions(skeleton)
  const defaultAssumptionForm: AssumptionForm = { name: '', value: '' }

  // TODO change state to redux instead?
  const savedValues = convertAssumptionsToForm(assumptionsFromProps)
  const [formValues, setFormValues] = useState(savedValues)
  const hasUnsaved = !equal(formValues, savedValues)

  useEffect(() => {
    setFormValues(convertAssumptionsToForm(assumptionsFromProps))
  }, [assumptionsFromProps])

  function onFieldChange(
    index: number,
    field: keyof AssumptionForm, // String, either "name" or "value"
    value: string
  ) {
    const newData: AssumptionForm = {
      ...formValues[index], // Original value
      ...{ [field]: value }, // Replace value of specified field with new value
    }
    replaceAssumption(index, newData)
  }

  function replaceAssumption(index: number, newData: AssumptionForm) {
    setFormValues([
      ...formValues.slice(0, index),
      ...[newData],
      ...formValues.slice(index + 1),
    ])
  }

  function removeAssumption(index: number) {
    setFormValues(formValues.filter((team, teamIndex) => index !== teamIndex))
  }

  function addAssumption() {
    setFormValues([...formValues, ...[defaultAssumptionForm]])
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const newAssumptions: Assumptions = convertFormToAssumptions(formValues)

      // to throw back the value to the Main Page and update the Assumptions state
      const newSkeleton = clone(skeleton ?? [])
      Sklt.setAssumptions(newSkeleton, newAssumptions)
      dispatch(setSkeleton({ sk: newSkeleton, caller: 'onAssumptionsSubmit' }))
    } catch (err) {
      alert(err)
    }
  }

  const onCancel = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setFormValues(convertAssumptionsToForm(assumptionsFromProps))
    } catch (err) {
      alert(err)
    }
  }

  return (
    //   TODO change UI to table format instead
    <BaseWidget {...props}>
      <div className="mt-2"></div>
      {hasUnsaved && (
        <div className="text-accent-0 mb-2">
          😥😥 <span className="font-bold">Note:</span> there are unsaved
          changes!
        </div>
      )}
      <table className="table-auto border-collapse">
        <thead>
          {/* Headers */}
          <tr className="bg-gray-1 text-gray-6">
            <th className="w-2/3 p-4 border border-gray-5">Assumption</th>
            <th className="p-4 border border-gray-5">Value</th>
            <th className="border border-gray-5"></th>
          </tr>
        </thead>
        <tbody>
          {formValues.map((assumption, index) => {
            return (
              <tr key={index}>
                <td className={'px-3 py-1 border-l border-gray-5'}>
                  {/* Assumption Name Input*/}
                  <input
                    className="px-2 py-1 border border-gray-5 w-full rounded focus:border-gray-2 text-sm"
                    name={'assumption_name_' + assumption.name}
                    placeholder="Insert Assumption"
                    value={assumption.name}
                    onChange={(e) =>
                      onFieldChange(index, 'name', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-1 border-gray-5">
                  {/* Assumption Value Input*/}
                  <input
                    className="px-2 py-1 border border-gray-5 w-full rounded focus:border-gray-2 text-sm"
                    name={'assumption_value_' + assumption.name}
                    placeholder="Insert Value"
                    value={assumption.value}
                    onChange={(e) =>
                      onFieldChange(index, 'value', e.target.value)
                    }
                  />
                </td>
                <td className="px-3 border-r border-gray-5">
                  {formValues.length > 1 && (
                    <div>
                      {/* Removes entire row */}
                      <button
                        className="btn-secondary px-3 py-1"
                        onClick={() => removeAssumption(index)}
                      >
                        -
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button className="btn-secondary mt-2 py-1" onClick={addAssumption}>
        +
      </button>
      {hasUnsaved && (
        <div className="flex mt-1">
          <button
            className="btn-secondary flex-1 -w-1/2 py-1 assumptions-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-primary flex-1 w-1/2 py-1 assumptions-save"
            onClick={onSubmit}
          >
            Save Changes
          </button>
        </div>
      )}
    </BaseWidget>
  )
}

export default AssumptionsWidget
