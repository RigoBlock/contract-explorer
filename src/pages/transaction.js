import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import withRoot from '../withRoot';
import Grid from 'material-ui/Grid';
import Web3 from 'web3';
import { vaulteventful } from '../abi'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
});

class TransactionPage extends React.Component {

  constructor(props) {
    super(props)
    this._web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/metamask'))
  }

  propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    txHash: ''
  };

  handleClick = () => {
    const web3 = this._web3
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
    const { classes } = this.props;
    const web3 = this._web3
    var instance = new web3.eth.Contract(vaulteventful, '0xd44842E8cf5E93Ac4CAc396ac2b5D8562393Cb81', )
    instance.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    .then(events =>{
      console.log(events)
    })
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="display1" gutterBottom>
              Transaction Hash
          </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="txHash"
              label="Tx Hash"
              className={classes.textField}
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

export default TransactionPage;