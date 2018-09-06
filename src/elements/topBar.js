import { EP_INFURA_KV_WS, EP_INFURA_RP_WS } from '../_utils/const'
import { withRouter } from 'react-router'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React from 'react'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import Web3 from 'web3'

class TopBar extends React.Component {
  static contextTypes = {
    web3: PropTypes.object.isRequired,
    networkInfo: PropTypes.object.isRequired
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    accountsError: PropTypes.bool.isRequired
  }

  state = {
    newBlock: {
      number: 0
    },
    accountsError: true,
    tabSelected: this.props.location.pathname.split('/')
  }

  onNewBlock = (error, newBlock) => {
    this.setState({
      newBlock
    })
  }

  UNSAFE_componentWillMount = async () => {
    // Subscribing to newBlockHeaders event. It will be fired at every new mined block.
    // console.log(this.context.web3)
    const web3 =
      this.context.networkInfo.id === 3
        ? new Web3(new Web3.providers.WebsocketProvider(EP_INFURA_KV_WS))
        : new Web3(new Web3.providers.WebsocketProvider(EP_INFURA_RP_WS))
    const subscription = await web3.eth.subscribe(
      'newBlockHeaders',
      this.onNewBlock
    )
    const accounts = await this.context.web3.eth.getAccounts()
    this.setState({
      subscription,
      account: accounts[0],
      accountText: accounts.length !== 0 ? accounts[0].substring(0, 6) : ''
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromEvent()
  }

  unsubscribeFromEvent = () => {
    const { subscription } = this.state
    // unsubscribes the subscription
    if (subscription) {
      subscription.unsubscribe(function(error, success) {
        if (success) console.log('Successfully unsubscribed!')
      })
    }
  }

  handleChange = (event, value) => {
    this.setState({
      tabSelected: value.split('/')
    })
    this.props.history.push(value)
  }

  render() {
    const styles = {
      counter: {
        textAlign: 'right',
        paddingRight: '5px',
        width: '100%',
        color: 'white'
      }
    }
    return (
      // <div>ok</div>
      <AppBar position="static">
        <Grid container spacing={0}>
          <Grid item xs={8}>
            <Tabs
              value={'/' + this.state.tabSelected[1]}
              onChange={this.handleChange}
            >
              <Tab label="Home" value="/" />
              <Tab label="Contracts" value="/contract" />
              <Tab label="Events" value="/events" />
              <Tab label="ZeroEx" value="/zeroex" />
            </Tabs>
          </Grid>
          <Grid item xs={4} style={{ margin: 'auto' }}>
            <div style={styles.counter}>
              <Typography variant="body2" style={styles.counter}>
                Account: {this.state.accountText}
                ... Network: {this.context.networkInfo.name} #
                {this.state.newBlock.number.toLocaleString('en')}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </AppBar>
    )
  }
}

export default withRouter(TopBar)
