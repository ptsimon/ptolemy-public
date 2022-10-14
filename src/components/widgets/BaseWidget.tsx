import React, { FC, ReactNode } from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import classnames from 'classnames'

type Props = {
  className?: string
  title: string
  subtitle?: string
  children?: ReactNode
}

/**
 * This is used to type props for the children of BaseWidget.
 * To use it in your new widget, you can use the following pattern:
 *
 *     const MyNewWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
 *       return (
 *         <BaseWidget {...props}>
 *           ...
 *         </BaseWidget>
 *       );
 *     }
 *
 * To use child-specific props, intersect the BaseChildProps with your custom props:
 *
 *     type Props = BaseChildProps & {
 *       myCustomProp: string
 *     }
 *
 * You can then use `Props` instead of `BaseChildProps` when defining your component
 */
export type BaseChildProps = {
  className?: string
  title: string
  subtitle?: string
}

const BaseWidget: FC<Props> = (props: Props) => (
  <div className="border border-solid border-gray-6 rounded shadow-md h-full flex flex-col p-4">
    <div
      className={classnames(
        'flex flex-row items-center justify-between rounded',
        props.className
      )}
    >
      <div className="text-accent-0 text-2xl">{props.title}</div>
      <DragIndicatorIcon className="handle cursor-move" />
    </div>
    {props.subtitle && (
      <div className="text-gray-900 mb-1">
        <div className="text-lg text-gray-2">{props.subtitle}</div>
      </div>
    )}
    {props.children}
  </div>
)

export default BaseWidget
