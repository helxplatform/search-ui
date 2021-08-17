import { Fragment, useState } from 'react'
import axios from 'axios'
import { Button, Divider, Input } from 'antd'
import ForceGraph2D from 'react-force-graph-2d'
import { useHelxSearch } from '../../'
import { RocketOutlined as QueryIcon } from '@ant-design/icons'

const { TextArea } = Input

const sampleQuery = `select chemical_substance->gene->disease
  from "/graph/gamma/quick"
 where disease="asthma"`

var data = {
  nodes: [
           { id: '321' },
    { id: '231' }, { id: '312' },
    { id: '132' }, { id: '213' },
           { id: '123' },
  ],
  links: [
    { source: '123', target: '132', value: 8 },
    { source: '123', target: '213', value: 10 },
    { source: '132', target: '231', value: 6 },
    { source: '132', target: '312', value: 6 },
    { source: '213', target: '231', value: 6 },
    { source: '213', target: '312', value: 6 },
    { source: '231', target: '321', value: 6 },
    { source: '312', target: '321', value: 6 },
  ]
};

export const TranQLTab = ({ result }) => {
  const { query } = useHelxSearch()
  const [tranqlQuery, setTranqlQuery] = useState(sampleQuery)
  const [translatorResponse, setTranslatorResponse] = useState(false)

  const fetchGraph = async () => {
    // const headers = {
    //   'Content-Type': 'text/plain',
    // }
    // try {
    //   const { data } = await axios({
    //     method: 'POST',
    //     url: 'https://tranql.renci.org/tranql/query?dynamic_id_resolution=true&asynchronous=true',
    //     data: JSON.stringify(tranqlQuery),
    //     headers,
    //   })
    //   if (!data) {
    //     console.log('no data')
    //     return
    //   }
    //   console.log(data)
    // } catch (error) {
    //   console.error(error)
    // }
    setTranslatorResponse(true)
  }

  return (
    <Fragment>
      <TextArea className="tranql-query-textarea" value={ tranqlQuery } rows="3" />
      <Button onClick={ fetchGraph } type="default" block icon={ <QueryIcon rotate={ 90 } style={{ padding: '0 1rem 0 1rem' }} /> } />
      <Divider />
      {
        translatorResponse && (
          <div style={{ backgroundColor: 'var(--color-unc-gray)', height: '100%' }}>
            <ForceGraph2D
              graphData={data}
              nodeLabel="id"
              linkCurvature="curvature"
              enablePointerInteraction={true}
              linkDirectionalParticleWidth={1}
              height={ 300 }
              width={ 400 }
            />
          </div>
        )
      }
    </Fragment>
  )
}

