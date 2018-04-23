import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from './withRoot';
import ContractPage from './pages/contract';
import EventsPage from './pages/events';
import HomePage from './pages/home';
import Web3 from 'web3';
import TopBar from './elements/topBar'
import Grid from 'material-ui/Grid';
import Exchange from './pages/exchange'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
});

class App extends Component {

  constructor(props) {
    super(props)
    var web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {

      // Use the browser's ethereum provider
      web3 = new Web3(window.web3.currentProvider)

    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
    this.state = {
      web3,
      newBlock: {
        number: 0
      },
      accountsError: true

    }
  }

  static childContextTypes = {
    web3: PropTypes.object
  };

  getChildContext() {
    return {web3: this.state.web3};
  }

  componentWillMount() {
    const { web3 } = this.state
    web3.eth.getAccounts()
    .then((accounts) => {
      if (typeof accounts[0] === 'undefined'){
        this.setState({ 
          accountsError: true
        });
      } else {
        this.setState({ 
          accountsError: false
        });
      }
    })
  }

  render() {
    return (
      <Grid container spacing={0} >
        <Grid item xs={12}>
          <TopBar accountsError={this.state.accountsError} ></TopBar>
        </Grid>
        <Grid item xs={12}>
          {!this.state.accountsError
            ? <Switch>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/contract' component={ContractPage} />
              <Route exact path='/events' component={EventsPage} />
              {/* <Route exact path='/rigoblock-api' component={RigoblockApi} /> */}
              <Route path='/zeroex' component={Exchange} />
            </Switch>
            : <Switch>
              <Route path='/' component={HomePage} />
            </Switch>
          }
        </Grid>
      </Grid>
    );
  }
}

export default withRoot(withStyles(styles)(App));
