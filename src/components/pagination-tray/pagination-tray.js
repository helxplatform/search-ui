import { navigate } from '@reach/router'
import { Pagination, Space } from 'antd'
import { useHelxSearch } from '../'
import './pagination-tray.css'

export const PaginationTray = () => {
  const { query, totalResults, currentPage } = useHelxSearch()

  return (
    <Space role="navigation" aria-label="Pagination Navigation" className="pagination-tray">
      <Pagination
        current={ currentPage }
        defaultPageSize={20}
        total={ totalResults }
        showTotal={total => `${ total } results`}
        onChange={ (page, pageSize) => navigate(`/?q=${ query }&p=${ page }`) }
        showSizeChanger={ false }
      />
    </Space>
  )
}
