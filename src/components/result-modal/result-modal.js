import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Divider, Input, List, Menu, Modal, Space, Tag, Typography } from 'antd'
import './result-modal.css'
import { KnowledgeGraphs, useHelxSearch } from '../'
import { Link } from '../link'
import { RocketOutlined as QueryIcon } from '@ant-design/icons'

const { Text, Title } = Typography
const { TextArea } = Input

const { CheckableTag: CheckableFacet } = Tag

const OverviewTab = ({ result }) => {
  return (
    <Fragment>
      <Title level={ 4 }>Overview</Title>
      <Text>{ result.description }</Text>
    </Fragment>
  )
}

const StudiesTab = ({ studies }) => {
  const [facets, setFacets] = useState([])
  const [selectedFacets, setSelectedFacets] = useState([])
  const [loading, setLoading] = useState(true)

  const handleSelectFacet = (facet, checked) => {
    const newSelection = new Set(selectedFacets)
    if (newSelection.has(facet)) {
      newSelection.delete(facet)
    } else {
      newSelection.add(facet)
    }
    setSelectedFacets([...newSelection])
  }

  useEffect(() => {
    setFacets(Object.keys(studies))
    setSelectedFacets(Object.keys(studies))
  }, [studies])

  return (
    <Fragment>
      <Title level={ 4 }>Studies</Title>
      <Space direction="horizontal" size="small">
        {
          facets.map(facet => studies[facet] && (
            <CheckableFacet
              key={ `search-facet-${ facet }` }
              checked={ selectedFacets.includes(facet) }
              onChange={ checked => handleSelectFacet(facet, checked) }
              children={ `${ facet } (${studies[facet].length})` }
            />
          ))
        }
      </Space>
      <List
        className="studies-list"
        dataSource={
          Object.keys(studies)
            .filter(facet => selectedFacets.includes(facet))
            .reduce((arr, facet) => [...arr, ...studies[facet]], [])
            .sort((s, t) => s.c_name < t.c_name ? -1 : 1)
        }
        renderItem={ item => (
          <List.Item>
            <div className="studies-list-item">
              <Text className="study-name">
                { item.c_name }{ ` ` }
                (<Link to={ item.c_link }>{ item.c_id }</Link>)
              </Text>
              <Text className="variables-count">{ item.elements.length } variable{ item.elements.length === 1 ? '' : 's' }</Text>
            </div>
          </List.Item>
        ) }
      />
   </Fragment>
  )
}

const KnowledgeGraphsTab = ({ graphs }) => {
  return (
    <Fragment>
      <Title level={ 4 }>Knowledge Graphs</Title>
      <KnowledgeGraphs graphs={ graphs } />
    </Fragment> 
  )
}

const sampleQuery = `select chemical_substance->gene->disease
  from "/graph/gamma/quick"
 where disease="asthma"`

export const TranQLTab = ({ result }) => {
  const { query } = useHelxSearch()
  const [tranqlQuery, setTranqlQuery] = useState(sampleQuery)
  const [translatorResponse, setTranslatorResponse] = useState('')

  const fetchGraph = async () => {
    const config = {
      headers: {
        'Content-Type': 'text/plain',
      }
    }
    try {
      const { data } = await axios.post(`https://tranql.renci.org/tranql/query?dynamic_id_resolution=true&asynchronous=true`, tranqlQuery, config)
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
      <Title level={ 4 }>TranQL</Title>
      <TextArea className="tranql-query-textarea" value={ tranqlQuery } rows="5" />
      <Button onClick={ fetchGraph } icon={ <QueryIcon /> } />
      <Divider />
      { translatorResponse }
    </Fragment>
  )
}

export const SearchResultModal = ({ result, visible, closeHandler }) => {
  const [currentTab, setCurrentTab] = useState('overview')
  const { fetchKnowledgeGraphs, fetchStudyVariables, query } = useHelxSearch()
  const [graphs, setGraphs] = useState([])
  const [studies, setStudies] = useState([])

  useEffect(() => {
    setCurrentTab('overview')
    if (!result) {
      return
    }
    const getVars = async () => {
      const { result: data } = await fetchStudyVariables(result.id, query)
      setStudies(data)
    }
    const getKgs = async () => {
      const kgs = await fetchKnowledgeGraphs(result.id)
      setGraphs(kgs)
    }
    getVars()
    getKgs()
  }, [fetchKnowledgeGraphs, fetchStudyVariables, result, query])

  if (!result) {
    return null
  }

  const tabs = {
    'overview': { title: 'Overview',         content: <OverviewTab result={ result } />, },
    'studies':  { title: `Studies`,          content: <StudiesTab studies={ studies } />, },
    'kgs':      { title: `Knowledge Graphs`, content: <KnowledgeGraphsTab graphs={ graphs } />, },
    'tranql':   { title: `TranQL`,           content: <TranQLTab /> },
  }

  return (
    <Modal
      title={ `${ result.name } (${ result.type })` }
      visible={ visible }
      onOk={ closeHandler }
      okText="Close"
      onCancel={ closeHandler }
      width={ 800 }
      style={{ top: 135 }}
      bodyStyle={{ padding: `0`, minHeight: `50vh` }}
      cancelButtonProps={{ hidden: true }}
    >
      <Space direction="horizontal" align="start">
        <Menu
          style={{ width: 256, height: '100%' }}
          defaultSelectedKeys={ ['overview'] }
          mode="inline"
          theme="light"
        >
          {
            Object.keys(tabs).map(key => <Menu.Item key={ key } onClick={ () => setCurrentTab(key) }>{ tabs[key].title }</Menu.Item>)
          }
        </Menu>
        <div className="modal-content-container" children={ tabs[currentTab].content } />
      </Space>
    </Modal>
  )
}
