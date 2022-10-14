import React, { FC, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks'
import {
  selectSelectedTemplate,
  selectTemplates,
  setSelectedTemplate,
} from './ChartSlice'
import { UsersIcon, AnnotationIcon } from '@heroicons/react/solid'
import { motion } from 'framer-motion'
import { Template } from '../../../libs/Template'

type Props = {
  onClick: (template: Template | undefined) => void
}

type TemplateCardProps = {
  template: Template
  onClick: (template: Template | undefined) => void
}

const TemplateCard: FC<TemplateCardProps> = (props: TemplateCardProps) => {
  const dispatch = useAppDispatch()
  const selectedTemplate: Template | undefined = useAppSelector(
    selectSelectedTemplate
  )
  const isSelected = selectedTemplate?.id == props.template.id
  const opacity = isSelected || !selectedTemplate?.id ? '' : 'opacity-30'
  const borderColor = isSelected ? 'border-accent-0' : 'border-gray-5'

  return (
    <motion.div
      className={`template-card w-40 h-20 rounded rounded-md mx-1 mt-2 mb-4 py-2 px-3 inline-block border ${borderColor} text-gray-1 shadow shadow-md cursor-pointer select-none bg-gray-6 ${opacity}`}
      whileHover={{
        backgroundColor: '#fcfafb',
        transition: { duration: 0.15 },
        y: -7,
      }}
      whileTap={{
        backgroundColor: '#ef4631',
        color: '#fff',
        transition: { duration: 0 },
      }}
      onClick={() => {
        if (!isSelected) {
          dispatch(setSelectedTemplate(props.template))
          props.onClick(props.template)
        } else {
          // Unselect
          dispatch(setSelectedTemplate(undefined))
          props.onClick(undefined)
        }
      }}
    >
      <div className="text-md leading-tight font-medium">
        {props.template.title}
      </div>
      <div className="flex mt-2">
        <AnnotationIcon className="w-3 h-3 flex-0 block mt-0.5" />
        <div className="text-xs ml-1 truncate leading-tight flex-1">
          {props.template.shortInfo}
        </div>
      </div>
      <div className="flex mt-0.5">
        <UsersIcon className="w-3 h-3 flex-0 block mt-0.5" />
        <div className="text-xs ml-1 truncate leading-tight flex-1">
          {props.template.authors.join(', ')}{' '}
        </div>
      </div>
    </motion.div>
  )
}

const matchesTemplate = (template: Template, searchString: string): boolean => {
  if (searchString == '') return true
  const query = searchString.trim()
  const fields = [
    template.title,
    template.shortInfo,
    template.keywords.join(', '),
    template.authors.join(', '),
  ]
  return fields.some((f) => f.toLowerCase().includes(query.toLowerCase()))
}

const ChartPopupTemplates: FC<Props> = (props: Props) => {
  const templates: Template[] | null = useAppSelector(selectTemplates)
  const [filterText, setFilterText] = useState('')

  return (
    <>
      <div className="overflow h-40 mb-1">
        <div className="text-sm text-gray-4 tracking-wider mt-4 mb-1 select-none cursor-default">
          TEMPLATES
        </div>
        <div className="text-sm text-gray-2 mb-2">
          🔎{' '}
          <input
            name="templatesFilter"
            className="w-24 border-b border-gray-3 pl-0.5"
            placeholder="filter"
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="w-full overflow-x-auto mt-1 whitespace-nowrap inviscroll-x">
          {templates === null ? (
            <span>Templates not loaded yet.</span>
          ) : (
            templates
              .filter((t) => matchesTemplate(t, filterText))
              .map((t) => (
                <TemplateCard key={t.id} template={t} onClick={props.onClick} />
              ))
          )}
        </div>
      </div>
    </>
  )
}

export default ChartPopupTemplates
