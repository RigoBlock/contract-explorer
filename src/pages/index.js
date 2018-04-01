import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import ContractPage from './contract';
import EventsPage from './events';
import HomePage from './home';
import Web3 from 'web3';
import TopBar from '../elements/topBar'
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
});

class Index extends React.Component {

  static childContextTypes = {
    web3: PropTypes.object
  };

  getChildContext() {
    return {web3: this.state.web3};
  }

  componentWillMount () {
    
    var web3
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {

      // Use the browser's ethereum provider
      web3 = new Web3(window.web3.currentProvider)

    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
    this.setState({web3});
  }

  render() {
    return (
      <Grid container spacing={0} >
        <Grid item xs={12}>
          <TopBar></TopBar>
        </Grid>
        <Grid item xs={12}>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/contract' component={ContractPage} />
            <Route exact path='/events' component={EventsPage} />
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

export default withRoot(withStyles(styles)(Index));
