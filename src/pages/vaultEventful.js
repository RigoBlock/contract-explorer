import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import withRoot from '../withRoot';
import Grid from 'material-ui/Grid';
import { vaulteventful } from '../abi'
import TopBar from '../elements/topBar'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
});

class VaultEventfulPage extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    txHash: ''
  };

  static contextTypes = {web3: PropTypes.object};

  handleClick = () => {
    console.log(this.context.web3.eth)
    this.context.web3.eth.getTransactionReceipt('0x768f85ea09ba5857f70e1e54d07970cd78c4948b3abc12f0d0b31e81996d2b42')
    .then(receipt =>{
      console.log(receipt)
    })
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    // const { classes } = this.props;
    console.log(this.context)
    const web3 = this.context.web3
    var instance = new web3.eth.Contract(vaulteventful, '0xd44842E8cf5E93Ac4CAc396ac2b5D8562393Cb81', )
    instance.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    .then(events =>{
      console.log(events)
    })
    return (
      <div>
        <Grid container spacing={24}>
        <Grid item xs={12}>
            <TopBar></TopBar>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="display1" gutterBottom>
              Eventfull Contract Events
          </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="txHash"
              label="Tx Hash"
              value={this.state.txHash}
              onChange={this.handleChange('txHash')}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="raised" color="primary" onClick={this.handleClick}>
              Check
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default VaultEventfulPage;