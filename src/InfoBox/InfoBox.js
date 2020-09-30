import React from 'react'
import numeral from 'numeral'
import './InfoBox.css'
import {Card, CardContent, Typography} from '@material-ui/core'

function InfoBox({title, cases, total, ...props}) {
  return (
    <Card onClick={props.onClick} className='InfoBox'>
      <CardContent>
        <Typography className='infoBox__title' color='textSecondary'>
          {title}
        </Typography>

        <h2 className='infoBox__cases'>{cases}</h2>

        <Typography className='infoBox__total'>
          {numeral(total).format("0,0")} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
