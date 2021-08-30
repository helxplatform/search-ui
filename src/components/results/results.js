import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Link } from '../link'
import { Button, Radio, notification, Spin, Menu, Tooltip, Typography } from 'antd'
import {
  LinkOutlined as LinkIcon,
  TableOutlined as GridViewIcon,
  UnorderedListOutlined as ListViewIcon,
} from '@ant-design/icons'
import { PaginationTray, SearchResultCard, SearchResultModal, useHelxSearch } from '../'
import pluralize from 'pluralize'

import './results.css'

const { Text } = Typography
const { SubMenu } = Menu

const GRID = 'GRID'
const LIST = 'LIST'

export const SearchResults = () => {
  const { basePath, query, results, totalResults, perPage, currentPage, pageCount, isLoadingResults, error, setSelectedResult } = useHelxSearch()
  const [layout, setLayout] = useState(GRID)
  const [selectedResultType, setSelectedResultType] = useState(null)


  const resultTypes = useMemo(() => {
    return [...new Set(results.map(r => r.type))]
  }, [results])

  useEffect(() => {
    if (resultTypes.length) {
      setSelectedResultType(resultTypes[0])
    }
  }, [resultTypes])

  const filteredResults = useMemo(() => {
    if (!selectedResultType) {
      return []
    }
    return results.filter(result => result.type === selectedResultType)
  }, [results, selectedResultType])

  const NotifyLinkCopied = () => {
    notification.open({ key: 'key', message: 'Link copied to clipboard'})
    navigator.clipboard.writeText(window.location.href)
  }

  const handleClickResultType = type => event => {
    setSelectedResultType(type)
  }

  const handleChangeLayout = event => setLayout(event.target.value)

  const MemoizedResultsHeader = useMemo(() => (
    <div className="header">
      <div className="results-summary">
        <Text>"{ query }" returned { filteredResults.length } { pluralize(selectedResultType || '') }</Text> 
      </div>
      <div className="shareable-link">
        <Tooltip title="Shareable link" placement="top">
          <Link to={ `${ basePath }?q=${ query }&p=${ currentPage }` } onClick={ NotifyLinkCopied }><LinkIcon /></Link>
        </Tooltip>
      </div>
      <div className="layout-config">
        <Tooltip title="Toggle Layout" placement="top">
          <Radio.Group value={ layout } onChange={ handleChangeLayout }>
            <Radio.Button value={ GRID }><GridViewIcon /></Radio.Button>
            <Radio.Button value={ LIST }><ListViewIcon /></Radio.Button>
          </Radio.Group>
        </Tooltip>
      </div>
    </div>
  ), [currentPage, layout, pageCount, selectedResultType, totalResults, query])

  if (isLoadingResults) {
    return <Spin style={{ display: 'block', margin: '4rem' }} />
  }

  return (
    <Fragment>

      { error && <span>{ error.message }</span> }

      {
        query && !error.message && (
          <div className="results">
            <Menu mode="horizontal" className="types-menu" selectedKeys={ [selectedResultType] }>
              {
                resultTypes && resultTypes.filter(type => !!type).map((type, i) => (
                  <Menu.Item key={ type } onClick={ handleClickResultType(type) }>{ pluralize(type) }</Menu.Item>
                ))
              }
            </Menu>
            { filteredResults.length >= 1 && MemoizedResultsHeader }

            <div className={ layout === GRID ? 'results-list grid' : 'results-list list' }>
              {
                filteredResults.map((result, i) => {
                  const index = (currentPage - 1) * perPage + i + 1
                  return (
                    <SearchResultCard
                      key={ `${query}_result_${index}` }
                      index={ index }
                      result={ result }
                      openModalHandler={ () => setSelectedResult(result) }
                    />
                  )
                })
              }
            </div>
          </div>
        )
      }

      <br/><br/>

      { pageCount > 1 && <PaginationTray count={ filteredResults.length } /> }

    </Fragment>
  )
}
