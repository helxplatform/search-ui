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
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  links: [
    { source: "B", target: "C", value: 8 },
    { source: "C", target: "D", value: 10 },
    { source: "D", target: "A", value: 6 },
    { source: "B", target: "A", value: 6 },
    { source: "B", target: "D", value: 6 },
  ]
};

export const TranQLTab = ({ result }) => {
  const { query } = useHelxSearch()
  const [tranqlQuery, setTranqlQuery] = useState(sampleQuery)
  const [translatorResponse, setTranslatorResponse] = useState('')

  const fetchGraph = async () => {
    const headers = {
      'Content-Type': 'text/plain',
    }
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://tranql.renci.org/tranql/query?dynamic_id_resolution=true&asynchronous=true',
        data: JSON.stringify(tranqlQuery),
        headers,
      })
      if (!data) {
        console.log('no data')
        return
      }
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Fragment>
      <TextArea className="tranql-query-textarea" value={ tranqlQuery } rows="5" />
      <Button onClick={ fetchGraph } icon={ <QueryIcon /> } />
      <Divider />
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        linkCurvature="curvature"
        enablePointerInteraction={true}
        linkDirectionalParticleWidth={1}
        height={ 400 }
        width={ 400 }
      />
    </Fragment>
  )
}

