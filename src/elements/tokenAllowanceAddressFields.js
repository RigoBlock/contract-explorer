import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

class TokenAllowanceAddressFields extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      prevProps: this.props,
      error: false,
      errorMsg: ''
    }
  }

  static contextTypes = { web3: PropTypes.object.isRequired }

  static propTypes = {
    tokenAllowanceAddress: PropTypes.string.isRequired,
    onTokenAllowanceAddressFieldChange: PropTypes.func.isRequired,
    tokenAllowanceAddressError: PropTypes.string.isRequired,
    spenderAddress: PropTypes.string.isRequired,
    spenderAddressError: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: true
  }

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <FormControl
            fullWidth={true}
            error={
              this.props.tokenAllowanceAddressError !== '' ||
              this.props.spenderAddressError !== ''
            }
          >
            <TextField
              id="tokenAllowanceAddress"
              label="Token address"
              InputLabelProps={{
                shrink: true
              }}
              placeholder="Address"
              fullWidth
              onChange={this.props.onTokenAllowanceAddressFieldChange}
              margin="normal"
              value={this.props.tokenAllowanceAddress}
              disabled={this.props.disabled}
            />
            <FormHelperText>
              {this.props.tokenAllowanceAddressError}
            </FormHelperText>
            <TextField
              id="spenderAddress"
              label="Spender address"
              InputLabelProps={{
                shrink: true
              }}
              placeholder="Address"
              fullWidth
              onChange={this.props.onTokenAllowanceAddressFieldChange}
              margin="normal"
              value={this.props.spenderAddress}
              disabled={this.props.disabled}
            />
            <FormHelperText>{this.props.spenderAddressError}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    )
  }
}

export default TokenAllowanceAddressFields
