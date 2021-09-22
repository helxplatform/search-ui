import { Fragment, useEffect, useState } from 'react'
import { Typography } from 'antd'
import { QuestionGraphs } from '../../graphs'
import { Link } from '../../link'
import { useHelxSearch } from '../../context'

const sampleQuery = `select gene->disease
  from "/graph/gamma/quick"
 where disease="thrombosis"`

export const QuestionGraphsTab = ({ graphs }) => {
  const { current } = useHelxSearch()
  return (
    <Fragment>
      <Link to={ `https://heal.renci.org/tranql/?q=${ encodeURI(sampleQuery) }` }>TranQL</Link><br />
      <QuestionGraphs graphs={ graphs } />
    </Fragment> 
  )
}
