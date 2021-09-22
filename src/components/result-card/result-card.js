import { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from '../link'
import { Button, Card, List, Space, Tag, Typography } from 'antd'
import { ExpandOutlined as ViewIcon } from '@ant-design/icons'
import { KnowledgeGraphs, useHelxSearch } from '../'
import { OverviewTab } from './overview-tab'
import { StudiesTab } from './studies-tab'
import { KnowledgeGraphsTab } from './knowledge-graphs-tab'
import {
  InfoCircleOutlined as OverviewIcon,
  BookOutlined as StudiesIcon,
  ShareAltOutlined as KnowledgeGraphsIcon,
  CodeOutlined as TranQLIcon,
  QuestionCircleOutlined as QuestionGraphsIcon,
  QuestionOutlined as AnswerViewerIcon,
} from '@ant-design/icons'
import './result-card.css'

const { Meta } = Card
const { CheckableTag: CheckableFacet } = Tag
const { Text } = Typography

export const SearchResultCard = ({ index, result, openModalHandler }) => {
  const [currentTab, setCurrentTab] = useState('overview')

  const tabs = {
    'overview': { title: 'Overview',         icon: <OverviewIcon />,         content: <OverviewTab result={ result } /> },
    'studies':  { title: `Studies`,          icon: <StudiesIcon />,          content: <StudiesTab result={ result } /> },
  }

  const tabList = Object.keys(tabs).map(key => {
    if (!tabs[key].content) {
      return null
    }
    return {
      key,
      tab: (
        <span>
          <span className="tab-icon">{ tabs[key].icon }</span>
          <span className="tab-name">{ tabs[key].title }</span>
        </span>
      ),
    }
  }).filter(tab => tab !== null)
  const tabContents = Object.keys(tabs).reduce((obj, key) => tabs[key].content ? ({ ...obj, [key]: tabs[key].content }) : obj, {})

  return (
    <Fragment>
      <Card
        className="result-card"
        title={ result.name }
        tabList={ tabList }
        tabProps={{ size: 'small' }}
        activeTabKey={ currentTab }
        onTabChange={ key => setCurrentTab(key) }
        extra={ <Button onClick={ openModalHandler } type="link" icon={ <ViewIcon /> } /> }
        actions={ [<br />] }
      >
        { tabContents[currentTab] }
      </Card>
   </Fragment>
  )
}

SearchResultCard.propTypes = {
  index: PropTypes.number.isRequired,
  result: PropTypes.object.isRequired,
  openModalHandler: PropTypes.func.isRequired,
}