import { Fragment, useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import { Button, Divider, Input, Spin, Typography } from 'antd'
import ForceGraph2D from 'react-force-graph-2d'
import { useHelxSearch } from '../../'
import { Link } from '../../link'
import { RocketOutlined as QueryIcon } from '@ant-design/icons'
import { SizeMe } from 'react-sizeme'
import './tranql-tab.css'

axios.defaults.timeout = 30000

const { Text } = Typography
const { TextArea } = Input

export const TranQLTab = ({ result }) => {
  const { query } = useHelxSearch()

  const initialTranqlQuery = useMemo(() => `select gene->disease
  from "/graph/gamma/quick"
 where ${ result.type }="${ result.name.toLowerCase() }"`, [result])
  const [tranqlQuery, setTranqlQuery] = useState(initialTranqlQuery)

  const [hasSearched, setHasSearched] = useState(false)
  const [busy,setBusy] = useState(false)

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const handleChangeTranqlQuery = event => {
    setTranqlQuery(event.target.value)
  }

  const handlePressEnter = event => {
    if (event.ctrlKey) {
      submitTranqlQuery()
    }
  }

  const submitTranqlQuery = useCallback(async () => {
    setBusy(true)
    setHasSearched(false)
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
      setNodes(data.knowledge_graph.nodes)
      setEdges(data.knowledge_graph.edges.map(edge => ({ source: edge.source_id, target: edge.target_id })))
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
      setHasSearched(true)
    }
  }, [result, tranqlQuery])

  return (
    <Fragment>
      <TextArea className="tranql-query-textarea" value={ tranqlQuery } onChange={ handleChangeTranqlQuery } rows="4" onPressEnter={ handlePressEnter } />
      
      <Button onClick={ submitTranqlQuery } type="primary" ghost block icon={ <QueryIcon rotate={ 90 } style={{ padding: '0' }} /> } loading={ busy } />
      
      <br /><br />
      <Link to={ `https://heal.renci.org/tranql/?q=${ encodeURI(tranqlQuery) }` }>View in TranQL</Link>
      <br />
      
      <Divider />
      
      { hasSearched && !nodes.length && !edges.length && <Text type="warning">no response from tranql query</Text>}
      
      <SizeMe>
        {
          ({ size }) => (
            <ForceGraph2D
              height={ 575 }
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

