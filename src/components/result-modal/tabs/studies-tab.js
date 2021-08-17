import { Fragment, useEffect, useState } from 'react'
import { List, Space, Tag, Typography } from 'antd'
import { Link } from '../../link'

const { Text } = Typography
const { CheckableTag: CheckableFacet } = Tag

export const StudiesTab = ({ studies }) => {
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