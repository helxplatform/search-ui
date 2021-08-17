import { Fragment } from 'react'
import { Typography } from 'antd'

const { Text } = Typography

export const OverviewTab = ({ result }) => {
  return (
    <Fragment>
      <Text>{ result.description }</Text>
    </Fragment>
  )
}
