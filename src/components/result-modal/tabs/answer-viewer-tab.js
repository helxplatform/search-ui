import { Fragment } from 'react'
import axios from 'axios'

export const AnswerViewerTab = ({ result }) => {
  return (
    <Fragment>
      <pre style={{ fontSize: '75%', overflowX: 'hidden' }}>
        { JSON.stringify(result, null, 2) }
      </pre>
    </Fragment>
  )
}

