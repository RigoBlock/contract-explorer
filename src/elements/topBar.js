import React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { EP_RIGOBLOCK_KV_DEV_WS } from '../_utils/const'
import Web3 from 'web3';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newBlock: {
        number: 0
      },
      accountsError: true,
      tabSelected: this.props.location.pathname.split('/'),
    }
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    accountsError: PropTypes.bool.isRequired,
  };

  onNewBlock = (error, newBlock) => {
    this.setState({ 
      newBlock
    });
  }

  componentWillMount() {
    // Subscribing to newBlockHeaders event. It will be fired at every new mined block.
    const web3Subscription = new Web3(EP_RIGOBLOCK_KV_DEV_WS)
    const subscription = web3Subscription.eth.subscribe('newBlockHeaders', this.onNewBlock)
    this.setState({
      subscription
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromEvent()
  }

  unsubscribeFromEvent = () => {
    const { subscription } = this.state
    // unsubscribes the subscription
    if (subscription) {
      subscription.unsubscribe(function (error, success) {
        if (success)
          console.log('Successfully unsubscribed!');
      });
    }
  }

  handleChange = (event, value) => {
    this.setState({
      tabSelected: value.split('/'),
    });
    this.props.history.push(value);
  };

  render() {
    const styles = {
      counter: {
        textAlign: "right",
        paddingRight: "5px",
        width: "100%",
        color: "white",
      }
    }

    return (
      <AppBar position="static">
        <Grid container spacing={0} >
          <Grid item xs={8}>
            <Tabs
              value={"/" + this.state.tabSelected[1]}
              onChange={this.handleChange}
            >
              <Tab label="Home" value="/" />
              <Tab label="Contracts" value="/contract" />
              <Tab label="Events" value="/events" />
              {/* <Tab label="RigoBlock API" value="/rigoblock-api" /> */}
              <Tab label="ZeroEx" value="/zeroex" />
            </Tabs>
          </Grid>
          <Grid item xs={4} style={{ margin: 'auto' }}>
            <div style={styles.counter}>
              <Typography variant="body2" style={styles.counter} >
                #{this.state.newBlock.number.toLocaleString('en')}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);