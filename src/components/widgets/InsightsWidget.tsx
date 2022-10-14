import React, { FC } from 'react'
import BaseWidget, { BaseChildProps } from './BaseWidget'

const InsightsWidget: FC<BaseChildProps> = (props: BaseChildProps) => {
  return <BaseWidget {...props}></BaseWidget>
}

export default InsightsWidget
