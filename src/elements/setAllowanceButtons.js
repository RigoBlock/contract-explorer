import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class SetAllowanceButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prevProps: this.props,
      error: false,
      errorMsg: ''
    }
  }

  static contextTypes = { web3: PropTypes.object.isRequired }

  static propTypes = {
    onSetAllowance: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: true
  }

  render() {
    return (
      <FormControl fullWidth={true}>
        <Grid container spacing={8}>
          <Grid item xs={6}>
            <Button
              id={'setAllowance'}
              disabled={this.props.disabled}
              variant="raised"
              color="primary"
              onClick={this.props.onSetAllowance}
              fullWidth={true}
            >
              Set allowance
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              id={'removeAllowance'}
              disabled={this.props.disabled}
              variant="raised"
              color="primary"
              onClick={this.props.onSetAllowance}
              fullWidth={true}
            >
              remove allowance
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    )
  }
}

export default SetAllowanceButtons
