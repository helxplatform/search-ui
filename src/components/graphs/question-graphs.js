import React, { Fragment, useEffect, useState } from 'react'
import { kgLink } from '../kg-links'
import { Link } from '../link'
import './knowledge-graphs.css'

export const QuestionGraphs = ({ graphs }) => {

  if (!graphs) {
    return <div>No Graphs Found</div>
  }

  return (
    <Fragment>
      <pre>
        { JSON.stringify(graphs, null, 2) }
      </pre>
    </Fragment>
  )
}
