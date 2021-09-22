import { useEffect, useState } from 'react'
import { Space, Spin } from 'antd'
import { useHelxSearch } from '../'
import { KnowledgeGraphs } from '../graphs'

export const KnowledgeGraphsTab = ({ result }) => {
  const { query, fetchGraphs } = useHelxSearch()
  const [graphs, setGraphs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getKgs = async () => {
      const graphs = await fetchGraphs(result.id)
      setGraphs(graphs.knowledge)
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
