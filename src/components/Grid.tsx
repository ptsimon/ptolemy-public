import React, { useState, useEffect, FC } from 'react'
import { Responsive, WidthProvider, Layouts, Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
const ResponsiveReactGridLayout = WidthProvider(Responsive)

type Props = {
  draggableHandle: string
  children?: React.ReactNode
  rowHeight: number
  layout: { [key: string]: Layout[] }
}

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }

const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

const Grid: FC<Props> = (props: Props) => {
  // TODO when are these updated?
  const [compactType] =
    useState<'horizontal' | 'vertical' | null | undefined>('vertical')
  const [mounted, setMounted] = useState(false)
  const [layouts] = useState<Layouts>(props.layout)

  useEffect(() => {
    // TODO what is this for?
    setMounted(true)
  }, [])

  return (
    <ResponsiveReactGridLayout
      draggableHandle={props.draggableHandle}
      rowHeight={props.rowHeight}
      cols={cols}
      breakpoints={breakpoints}
      layouts={layouts}
      measureBeforeMount={false}
      useCSSTransforms={mounted}
      compactType={compactType}
      preventCollision={!compactType}
    >
      {props.children}
    </ResponsiveReactGridLayout>
  )
}

export default Grid
