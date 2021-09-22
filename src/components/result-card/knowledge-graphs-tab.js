import { useEffect, useState } from 'react'
import { Space, Spin } from 'antd'
import { KnowledgeGraphs, useHelxSearch } from '../'

export const KnowledgeGraphsTab = ({ result }) => {
  const { query, fetchGraphs } = useHelxSearch()
  const [graphs, setGraphs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getKgs = async () => {
      const graphs = await fetchGraphs(result.id)
      setGraphs(graphs.knowledgeGraphs)
      setLoading(false)
    }
    getKgs()
  }, [fetchGraphs, query])

  if (loading) {
    return <Spin />
  }

  return (
    <Space direction="vertical" className="tab-content">
      <KnowledgeGraphs graphs={ graphs } />
    </Space>
  )
}
