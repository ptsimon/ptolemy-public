import React, { FC } from 'react'
import Header from '../components/Header'
import classnames from 'classnames'
import Grid from '../components/Grid'
import { CodeEditorWidget } from '../components/widgets/code/CodeEditorWidget'
import TitleWidget from '../components/widgets/title/TitleWidget'
import BreakdownWidget from '../components/widgets/breakdown/BreakdownWidget'
import AssumptionsWidget from '../components/widgets/assumptions/AssumptionsWidget'
import InsightsWidget from '../components/widgets/InsightsWidget'
import ProjectionsWidget from '../components/widgets/projections/ProjectionsWidget'
import { Constants } from '../pages/ConstantDefinitions'
import NewChartWidget from '../components/widgets/chart/NewChartWidget'
import layouts from '../core/Layouts'
import { useAppDispatch, useAppSelector } from '../core/redux/hooks'
import {
  selectSkeleton,
  setSkeleton,
} from '../components/widgets/main/MainSlice'
import { Skeleton } from '../core/types'
import {
  selectTemplates,
  setTemplates,
} from '../components/widgets/chart/ChartSlice'
import DefaultTemplates from '../components/widgets/chart/DefaultTemplates'
import { Template } from '../libs/Template'

let initialized = false

// TODO put here for now, move when we do our backend. These will be replaced by API calls
const loadInitialSkeleton = () => {
  if (initialized) return
  const dispatch = useAppDispatch()
  const skeleton: Skeleton | undefined = useAppSelector(selectSkeleton)
  const templates: Template[] | null = useAppSelector(selectTemplates)
  if (!skeleton)
    dispatch(setSkeleton({ sk: Constants.SAMPLE_TCO, caller: 'init' }))
  if (templates === null) dispatch(setTemplates(DefaultTemplates))
  initialized = true
}

const MainPage: FC = () => {
  loadInitialSkeleton()
  return (
    <>
      <Header />
      <div className={classnames('w-8/12', 'm-auto')}>
        <Grid draggableHandle=".handle" rowHeight={60} layout={layouts}>
          <div key="title">
            <TitleWidget title="Ptolemy TCO Calculator" />
          </div>
          <div key="chart">
            <NewChartWidget title="TCO Graph" subtitle="Components Diagram" />
          </div>
          <div id="Code_Editor_Widget" key="code">
            <CodeEditorWidget title="TCO Skeleton" />
          </div>
          <div key="assumptions">
            <AssumptionsWidget
              title="Assumptions"
              subtitle="Assumptions are essential."
            />
          </div>
          <div key="breakdown">
            <BreakdownWidget
              title="TCO Cost Breakdown"
              subtitle="Component breakdown"
            />
          </div>
          <div key="insights">
            <InsightsWidget title="Insights" subtitle="Wow cool graphs" />
          </div>
          <div key="projections">
            <ProjectionsWidget
              title="Projections"
              subtitle="This is a window to the future."
            />
          </div>
        </Grid>
      </div>
    </>
  )
}

export default MainPage
