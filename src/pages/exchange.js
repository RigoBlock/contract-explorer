import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import ExchangeLeftMenu from '../elements/exchangeLeftMenu'
import { Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'
import ExchangeOrderCreator from './exchangeOrderCreator'
import ExchangeOrderValidator from './exchangeOrderValidator'

const drawerWidth = 150;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minWidth: 0, // So the Typography noWrap works
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  toolbar: theme.mixins.toolbar,
});

class Exchange extends React.Component {


  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <div className={this.props.classes.root}>
            <Drawer
              variant="permanent"
              classes={
                {
                  paper: this.props.classes.drawerPaper
                }
              }
            >
              <div />
              <ExchangeLeftMenu />
            </Drawer>
            <main className={this.props.classes.content}>
            <Switch>
              <Route exact path='/zeroex/orders-creator' component={ExchangeOrderCreator} />
              <Route exact path='/zeroex/orders-validator' component={ExchangeOrderValidator} />
            </Switch>
            </main>
          </div>
        </Grid>
      </Grid>
    );
  }
}

Exchange.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withRouter(withStyles(styles)(Exchange));
