import { useEffect, useState } from 'react'
import { Menu, Modal, Space, Typography } from 'antd'
import './result-modal.css'
import { useHelxSearch } from '../'
import { OverviewTab, StudiesTab, KnowledgeGraphsTab, TranQLTab, QuestionGraphsTab, AnswerViewerTab } from './tabs'
import {
  InfoCircleOutlined as OverviewIcon,
  BookOutlined as StudiesIcon,
  ShareAltOutlined as KnowledgeGraphsIcon,
  CodeOutlined as TranQLIcon,
  QuestionCircleOutlined as QuestionGraphsIcon,
  QuestionOutlined as AnswerViewerIcon,
} from '@ant-design/icons'

const { Text, Title } = Typography

export const SearchResultModal = ({ result, visible, closeHandler }) => {
  const [currentTab, setCurrentTab] = useState('overview')
  const { fetchGraphs, fetchStudyVariables, query } = useHelxSearch()
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
    const getGraphs = async () => {
      const graphs = await fetchGraphs(result.id)
      setGraphs(graphs)
    }
    getVars()
    getGraphs()
  }, [fetchGraphs, fetchStudyVariables, result, query])

  if (!result) {
    return null
  }

  const tabs = {
    'overview':      { title: 'Overview',            icon: <OverviewIcon />,         content: <OverviewTab result={ result } />, },
    'studies':       { title: 'Studies',             icon: <StudiesIcon />,          content: <StudiesTab studies={ studies } />, },
    'kgs':           { title: 'Knowledge Graphs',    icon: <KnowledgeGraphsIcon />,  content: <KnowledgeGraphsTab graphs={ graphs.knowledge } />, },
    'qgs':           { title: 'Question Graphs',     icon: 'Q',                      content: <QuestionGraphsTab graphs={ graphs.question } />, },
    'answer-viewer': { title: 'Answer Viewer',       icon: 'A',                      content: <AnswerViewerTab result={ result } /> },
    'tranql':        { title: 'TranQL',              icon: <TranQLIcon />,           content: <TranQLTab result={ result } />, },
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
          className="tab-menu"
          defaultSelectedKeys={ ['overview'] }
          mode="inline"
          theme="light"
        >
          {
            Object.keys(tabs).map(key => (
              <Menu.Item className="tab-menu-item" key={ key } onClick={ () => setCurrentTab(key) }>
                <span className="tab-icon">{ tabs[key].icon }</span> &nbsp; <span className="tab-name">{ tabs[key].title }</span>
              </Menu.Item>
            ))
          }
        </Menu>
        <div className="modal-content-container" children={ tabs[currentTab].content } />
      </Space>
    </Modal>
  )
}
