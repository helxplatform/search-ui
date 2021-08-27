import { navigate } from '@reach/router'
import { Pagination, Space } from 'antd'
import { useHelxSearch } from '../'
import './pagination-tray.css'

export const PaginationTray = ({ count }) => {
  const { basePath, query, currentPage } = useHelxSearch()

  return (
    <Space role="navigation" aria-label="Pagination Navigation" className="pagination-tray">
      <Pagination
        current={ currentPage }
        defaultPageSize={ 20 }
        total={ count }
        showTotal={total => `${ total } results`}
        onChange={ (page, pageSize) => navigate(`${ basePath }?q=${ query }&p=${ page }`) }
        showSizeChanger={ false }
      />
    </Space>
  )
}
