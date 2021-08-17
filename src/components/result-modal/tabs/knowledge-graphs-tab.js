import { Fragment, useEffect, useState } from 'react'
import { Typography } from 'antd'
import { KnowledgeGraphs } from '../../'

export const KnowledgeGraphsTab = ({ graphs }) => {
  return (
    <Fragment>
      <KnowledgeGraphs graphs={ graphs } />
    </Fragment> 
  )
}
