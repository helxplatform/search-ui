import { Fragment, useEffect, useState } from 'react'
import { Typography } from 'antd'
import { QuestionGraphs } from '../../graphs'

export const QuestionGraphsTab = ({ graphs }) => {
  return (
    <Fragment>
      <QuestionGraphs graphs={ graphs } />
    </Fragment> 
  )
}
