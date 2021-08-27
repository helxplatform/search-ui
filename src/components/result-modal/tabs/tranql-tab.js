import { Fragment, useState } from 'react'
import axios from 'axios'
import { Button, Divider, Input, Spin, Typography } from 'antd'
import ForceGraph2D from 'react-force-graph-2d'
import { useHelxSearch } from '../../'
import { RocketOutlined as QueryIcon } from '@ant-design/icons'
import { SizeMe } from 'react-sizeme'
import './tranql-tab.css'

axios.defaults.timeout = 20000 // ten seconds

const { Text } = Typography
const { TextArea } = Input

export const TranQLTab = ({ result }) => {
  const { query } = useHelxSearch()
  const [hasSearched, setHasSearched] = useState(false)
  const [tranqlQuery, setTranqlQuery] = useState(`select gene->disease
  from "/graph/gamma/quick"
 where disease="${ result.name.toLowerCase() }"`)
  const [busy,setBusy] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const fetchGraph = async () => {
    setBusy(true)
    setHasSearched(false)
    const headers = {
      'Content-Type': 'text/plain',
    }
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://heal.renci.org/tranql/query?dynamic_id_resolution=true&asynchronous=true',
        data: tranqlQuery,
        headers,
      })
      if (!data) {
        console.log('no data')
        return
      }
      setNodes(data.knowledge_graph.nodes)
      setEdges(data.knowledge_graph.edges.map(edge => ({ source: edge.source_id, target: edge.target_id })))
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
      setHasSearched(true)
    }
  }

  return (
    <Fragment>
      <TextArea className="tranql-query-textarea" value={ tranqlQuery } rows="3" />
      <Button onClick={ fetchGraph } type="primary" ghost block icon={ <QueryIcon rotate={ 90 } style={{ padding: '0 1rem 0 1rem' }} /> } loading={ busy } />
      <Divider />
      { hasSearched && !nodes.length && !edges.length && <Text type="warning">no response from tranql query</Text>}
      <SizeMe>
        {
          ({ size }) => (
            <ForceGraph2D
              height={ 600 }
              width={ size.width }
              graphData={{ nodes: nodes, links: edges }}
              nodeLabel="id"
              linkColor={ () => 'rgba(0,0,0,0.2)' }
              enablePointerInteraction={ true }
              d3VelocityDecay={ 0.25 }
            />
          )
        }
      </SizeMe>
    </Fragment>
  )
}

