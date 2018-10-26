import './App.css'
import { Route, Switch } from 'react-router-dom'
import { networkInfo } from './_utils/const'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import ContractPage from './pages/contract'
import EventsPage from './pages/events'
import Exchange from './pages/exchange'
import Grid from '@material-ui/core/Grid'
import HomePage from './pages/home'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TopBar from './elements/topBar'
import Web3 from 'web3'
import withRoot from './withRoot'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    let web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use the browser's ethereum provider
      try {
        web3 = new Web3(window.web3.currentProvider)
      } catch (err) {
        console.warn(err)
      }
    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
    this.state = {
      loading: true,
      web3,
      accounts: [],
      accountsError: true,
      networkInfo: {}
    }
  }

  static childContextTypes = {
    web3: PropTypes.object,
    accounts: PropTypes.array,
    networkInfo: PropTypes.object
  }

  getChildContext() {
    return {
      web3: this.state.web3,
      accounts: this.state.accounts,
      networkInfo: this.state.networkInfo
    }
  }

  UNSAFE_componentWillMount = async () => {
    const { web3 } = this.state
    const accounts = await web3.eth.getAccounts()
    const networId = await web3.eth.net.getId()
    if (typeof accounts[0] === 'undefined') {
      this.setState({
        accountsError: true,
        networkInfo: networkInfo[networId],
        loading: false
      })
    } else {
      this.setState({
        accounts,
        accountsError: false,
        networkInfo: networkInfo[networId],
        loading: false
      })
    }
  }

  render() {
    return this.state.loading ? (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <TopBar accountsError={this.state.accountsError} />
        </Grid>
        <div className="progress">
          <CircularProgress size={50} />
        </div>
      </Grid>
    ) : (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <TopBar accountsError={this.state.accountsError} />
        </Grid>
        <Grid item xs={12}>
          {!this.state.accountsError ? (
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/contract" component={ContractPage} />
              <Route exact path="/events" component={EventsPage} />
              <Route path="/zeroex" component={Exchange} />
              <Route path="/zeroex/orders-tools" component={Exchange} />
            </Switch>
          ) : (
            <Switch>
              <Route path="/" component={HomePage} />
            </Switch>
          )}
        </Grid>
      </Grid>
    )
  }
}

export default withRoot(withStyles(styles)(App))
