import React, { Fragment, useEffect, useState } from 'react'
import { kgLink } from '../kg-links'
import { Link } from '../link'
import './graphs.css'

const QuestionGraph = ({ graph }) => {
  const [interactions, setInteractions] = useState([])

  useEffect(() => {
    if (graph) {
      graph.nodes.forEach(sourceNode => {
        const outgoingEdge = graph.edges.find(edge => edge.source_id === sourceNode.id)
        if (outgoingEdge) {
          const targetNode = graph.nodes.find(node => node.id === outgoingEdge.target_id)
          let newInteraction = {
            type: outgoingEdge.id,
            source: { id: sourceNode.id, name: sourceNode.id },
            target: { id: targetNode.id, name: targetNode.id },
          }
          console.log(newInteraction)
          setInteractions(interactions => [...interactions, newInteraction])
        }
      })
    }
  }, [graph])

  return interactions.map((interaction, i) => (
    <Fragment key={ `kg-${ i }` }>
      <div className="source-label">{ interaction.source.name }</div>
      <div />
      <div className="target-label">{ interaction.target.name }</div>

      <div className="source-node"><span className="node" /></div>
      <div className="edge">
        <div className="edge-type">{interaction.type}</div>
      </div>
      <div className="target-node"><span className="node" /></div>
    </Fragment>
  ))
}

const NoQuestionGraphsMessage = () => {
  return (
    <div>No Graphs Found</div>
  )
}

export const QuestionGraphs = ({ graphs }) => {
  console.log('in qg', graphs)
  if (graphs && graphs.length > 0) {
    return (
      <div className="interactions-grid">
        <div className="column-title">Ontological Term)</div>
        <div className="column-title">Interaction Type</div>
        <div className="column-title">Linked Term</div>
        { graphs.map(graph => <QuestionGraph graph={ graph } />)}
      </div>
    )
  }

  return <NoQuestionGraphsMessage />
}