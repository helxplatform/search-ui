import { Fragment, useState } from 'react'
import axios from 'axios'
import { Button, Divider, Input } from 'antd'
import ForceGraph2D from 'react-force-graph-2d'
import { useHelxSearch } from '../../'
import { RocketOutlined as QueryIcon } from '@ant-design/icons'
import './tranql-tab.css'

const { TextArea } = Input

export const TranQLTab = ({ result }) => {
  const { query } = useHelxSearch()
  const [tranqlQuery, setTranqlQuery] = useState(`select chemical_substance->gene->disease
  from "/graph/gamma/quick"
 where disease="${ result.name }"`)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const fetchGraph = async () => {
    const headers = {
      'Content-Type': 'text/plain',
    }
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://tranql.renci.org/tranql/query?dynamic_id_resolution=true&asynchronous=true',
        data: tranqlQuery,
        headers,
      })
      if (!data) {
        console.log('no data')
        return
      }
      console.log(data)
      setNodes(data.knowledge_graph.nodes)
      setEdges(data.knowledge_graph.edges.map(edge => ({ source: edge.source_id, target: edge.target_id })))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Fragment>
      <TextArea className="tranql-query-textarea" value={ tranqlQuery } rows="3" />
      <Button onClick={ fetchGraph } type="default" block icon={ <QueryIcon rotate={ 90 } style={{ padding: '0 1rem 0 1rem' }} /> } />
      <Divider />
      {
        nodes && edges && (
          <ForceGraph2D
            height={ 400 }
            width={ 400 }
            graphData={{ nodes: nodes, links: edges }}
            nodeLabel="id"
            linkColor={ () => 'rgba(0,0,0,0.2)' }
            enablePointerInteraction={ true }
            d3VelocityDecay={ 0.25 }
          />
        )
      }
    </Fragment>
  )
}

