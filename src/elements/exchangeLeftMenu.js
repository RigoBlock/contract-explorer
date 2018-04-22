import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom'


class ExchangeLeftMenu extends React.Component {


  render() {
    return (
      <List component="nav">
              <ListItem button component={Link} to="/zeroex/orders-creator">
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/zeroex/orders-validator">
          <ListItemText primary="Validator" />
        </ListItem>
      </List>
    );
  }
}

export default ExchangeLeftMenu;