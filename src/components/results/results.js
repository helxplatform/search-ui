import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Link } from '../link'
import { Button, Radio, notification, Spin, Tooltip, Typography } from 'antd'
import {
  LinkOutlined as LinkIcon,
  TableOutlined as GridViewIcon,
  UnorderedListOutlined as ListViewIcon,
} from '@ant-design/icons'
import { PaginationTray, SearchResultCard, SearchResultModal, useHelxSearch } from '../'
import './results.css'

const { Text } = Typography

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


  const NotifyLinkCopied = () => {
    notification.open({ key: 'key', message: 'Link copied to clipboard'})
    navigator.clipboard.writeText(window.location.href)
  }

  const handleClickResultType = event => {
    setSelectedResultType(event.target.innerText)
  }

  const handleChangeLayout = event => setLayout(event.target.value)

  const MemoizedResultsHeader = useMemo(() => (
    <div className="header">
      <div>
        <Text>{ totalResults } results for "{ query }" ({ pageCount } page{ pageCount > 1 && 's' })</Text> 
      </div>
      <div className="types-list">
        {
          resultTypes && resultTypes.map((type, i) => (
            <Button
              key={ `type-button-${ type }` }
              type={ type === selectedResultType ? 'primary' : 'link' }
              ghost={ type === selectedResultType }
              onClick={ handleClickResultType }>{ type }</Button>
          ))
        }
      </div>
      <div>
        <Tooltip title="Shareable link" placement="top">
          <Link to={ `${ basePath }?q=${ query }&p=${ currentPage }` } onClick={NotifyLinkCopied}><LinkIcon /></Link>
        </Tooltip>
      </div>
      <div>
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
            { results.length >= 1 && MemoizedResultsHeader }

            <div className={ layout === GRID ? 'results-list grid' : 'results-list list' }>
              {
                results.map((result, i) => {
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

      { pageCount > 1 && <PaginationTray /> }

    </Fragment>
  )
}
