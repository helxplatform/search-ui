import { useEffect, useState } from 'react'
import { Menu, Modal, Space, Typography } from 'antd'
import './result-modal.css'
import { useHelxSearch } from '../'
import { OverviewTab, StudiesTab, KnowledgeGraphsTab, TranQLTab } from './tabs'
import {
  InfoCircleOutlined as OverviewIcon,
  BookOutlined as StudiesIcon,
  ShareAltOutlined as KnowledgeGraphsIcon,
  CodeOutlined as TranQLIcon,
} from '@ant-design/icons'

const { Text, Title } = Typography

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
    'overview': { title: 'Overview',            icon: <OverviewIcon />,         content: <OverviewTab result={ result } />, },
    'studies':  { title: 'Studies',             icon: <StudiesIcon />,          content: <StudiesTab studies={ studies } />, },
    'kgs':      { title: 'Knowledge Graphs',    icon: <KnowledgeGraphsIcon />,  content: <KnowledgeGraphsTab graphs={ graphs } />, },
    'tranql':   { title: 'TranQL',              icon: <TranQLIcon />,           content: <TranQLTab /> },
  }

  return (
    <Modal
      title={ `${ result.name } (${ result.type })` }
      visible={ visible }
      onOk={ closeHandler }
      okText="Close"
      onCancel={ closeHandler }
      width={ 1200 }
      style={{ top: 135 }}
      bodyStyle={{ padding: `0`, minHeight: `50vh` }}
      cancelButtonProps={{ hidden: true }}
    >
      <Space direction="horizontal" align="start">
        <Menu
          style={{ width: 256 }}
          defaultSelectedKeys={ ['overview'] }
          mode="inline"
          theme="light"
        >
          {
            Object.keys(tabs).map(key => <Menu.Item key={ key } onClick={ () => setCurrentTab(key) }>{ tabs[key].icon } &nbsp; { tabs[key].title }</Menu.Item>)
          }
        </Menu>
        <div className="modal-content-container" children={ tabs[currentTab].content } />
      </Space>
    </Modal>
  )
}
