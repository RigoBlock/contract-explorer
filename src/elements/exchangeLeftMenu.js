import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'

class ExchangeLeftMenu extends React.Component {
  render() {
    return (
      <List component="nav">
        <ListItem button component={Link} to="/zeroex/orders-creator">
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/zeroex/orders-filler">
          <ListItemText primary="Filler" />
        </ListItem>
        <ListItem button component={Link} to="/zeroex/orders-tools">
          <ListItemText primary="Tools" />
        </ListItem>
        <ListItem button component={Link} to="/zeroex/orders-validator">
          <ListItemText primary="Validator" />
        </ListItem>
      </List>
    )
  }
}

export default ExchangeLeftMenu
