import '../App.css'
import * as Drago from '../_utils/drago_utils'
import Button from '@material-ui/core/Button'
import EtherscanLink from '../elements/etherscanLink'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'

class LockToken extends Component {
  static propTypes = {
    token: PropTypes.object.isRequired,
    amountToLock: PropTypes.string.isRequired,
    amountToUnlock: PropTypes.string.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    onChangeTime: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    errorMsg: PropTypes.object.isRequired,
    tokenLock: PropTypes.func.isRequired,
    tokenUnLock: PropTypes.func.isRequired,
    timeToLock: PropTypes.string.isRequired,
    loading: PropTypes.bool
  }

  static defaultProps = {
    token: {},
    amountToLock: '0',
    amountToUnlock: '0',
    errorMsg: {
      amountToLock: '',
      amountToUnlock: ''
    },
    disabled: true,
    loading: false
  }

  onChangeAmount = event => {
    this.props.onChangeAmount(event.target.value, event.target.id)
  }

  onChangeTime = event => {
    this.props.onChangeTime(event.target.value)
  }

  render() {
    const {
      disabled,
      token,
      errorMsg,
      amountToLock,
      timeToLock,
      amountToUnlock,
      loading
    } = this.props
    return (
      <FormControl error={errorMsg !== ''} fullWidth={true} margin={'normal'}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <p>
              {token.symbol}: {<EtherscanLink address={token.address} />}
            </p>
            Available to lock:&nbsp;
            {typeof token.availableBalance !== 'undefined'
              ? Drago.toUnitAmount(
                  token.availableBalance,
                  token.decimals
                ).toFixed(4)
              : Drago.toUnitAmount('0', token.decimals).toFixed(4)}{' '}
            {token.symbol}
          </Grid>
          <Grid item xs={6}>
            <p>
              {token.wrappers.Ethfinex.symbol}:{' '}
              {<EtherscanLink address={token.wrappers.Ethfinex.address} />}
            </p>
            Locked:&nbsp;
            {typeof token.wrappedBalance !== 'undefined'
              ? Drago.toUnitAmount(
                  token.wrappedBalance,
                  token.decimals
                ).toFixed(4)
              : Drago.toUnitAmount('0', token.decimals).toFixed(4)}{' '}
            {token.symbol}
            <br />
            Expiry time:&nbsp;
            {typeof token.lockTime !== 'undefined' && token.lockTime !== '0'
              ? moment
                  .unix(token.lockTime)
                  .format('dddd, MMMM Do YYYY, h:mm:ss a')
              : 'N/A'}{' '}
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <TextField
                  id={'amountToLock'}
                  disabled={disabled}
                  label="Amount to lock"
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="Amount"
                  onChange={this.onChangeAmount}
                  fullWidth
                  margin="normal"
                  value={amountToLock}
                />
                <FormHelperText>{errorMsg.amountToLock}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id={'amountToLock'}
                  disabled={disabled}
                  label="Time to lock (1h)"
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="Time"
                  onChange={this.onChangeTime}
                  fullWidth
                  margin="normal"
                  value={timeToLock}
                />
                <FormHelperText>{errorMsg.timeToLock}</FormHelperText>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id={'amountToUnlock'}
              disabled={disabled}
              label="Amount to unlock"
              InputLabelProps={{
                shrink: true
              }}
              placeholder="Amount"
              onChange={this.onChangeAmount}
              fullWidth
              margin="normal"
              value={amountToUnlock}
            />
            <FormHelperText>{errorMsg.amountToUnlock}</FormHelperText>
          </Grid>

          <Grid item xs={6} />

          <Grid item xs={12}>
            {loading && <LinearProgress />}
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={
                disabled ||
                errorMsg.amountToLock !== '' ||
                amountToLock === '0' ||
                errorMsg.timeToLock !== ''
              }
              variant="contained"
              color="primary"
              onClick={this.props.tokenLock}
              fullWidth={true}
            >
              Lock
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={
                disabled ||
                errorMsg.amountToUnlock !== '' ||
                amountToUnlock === '0'
              }
              variant="contained"
              color="secondary"
              onClick={this.props.tokenUnLock}
              fullWidth={true}
            >
              Unlock
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    )
  }
}

export default LockToken
