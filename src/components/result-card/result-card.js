import { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'antd'
import { ExpandOutlined as ViewIcon } from '@ant-design/icons'
import './result-card.scss'

const { Meta } = Card

export const SearchResultCard = ({ index, result, openModalHandler }) => {
  return (
    <Fragment>
      <Card
        className="result-card"
        title={ result.name }
        onClick={ openModalHandler }
        extra={ <Button onClick={ openModalHandler } type="link" icon={ <ViewIcon /> } /> }
        actions={ [<br />] }
      >
        <Meta description={ result.description } className="description" />
      </Card>
   </Fragment>
  )
}

SearchResultCard.propTypes = {
  index: PropTypes.number.isRequired,
  result: PropTypes.object.isRequired,
  openModalHandler: PropTypes.func.isRequired,
}