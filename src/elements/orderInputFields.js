import { BigNumber } from '@0xproject/utils'
import { ETHERSCAN_KOVAN } from '../_utils/const'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

class OrderInputFields extends Component {
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
    onSignOrder: PropTypes.func.isRequired,
    onOrderChange: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { prevProps } = prevState
  //   if (nextProps.methodSelected.name !== prevProps.methodSelected.name) {
  //     return {
  //       inputs: Array.apply(null, Array(nextProps.methodSelected.inputs.length)).map(function () { return ""}),
  //       value: 0,
  //       prevProps: nextProps,
  //     };
  //   }
  //   // Return null to indicate no change to state.
  //   return null;
  // }

  // onSend = () => {
  //   const { inputs, value } = this.state
  //   this.props.onSend(inputs, value)
  // }

  onTextFieldChange = event => {
    const { order } = this.props
    const newOrder = { ...order, ...{ [event.target.id]: event.target.value } }
    this.props.onOrderChange(newOrder)
  }

  renderLabel = (label, value) => {
    let labels = [
      'maker',
      'taker',
      'feeRecipient',
      'makerTokenAddress',
      'takerTokenAddress',
      'exchangeContractAddress'
    ]
    return labels.includes(label)
      ? [
          label + ' ',
          <a
            key={label}
            href={ETHERSCAN_KOVAN + '/address/' + value}
            target="_blank"
          >
            <Icon color="primary">open_in_new</Icon>
          </a>
        ]
      : label
  }

  renderInputFields = () => {
    const { order } = this.props
    let textFields = []
    let fieldValue
    for (let key in order) {
      fieldValue = order[key]

      if (typeof order[key] === 'string') {
        fieldValue = order[key].toLowerCase()
      } else {
        fieldValue = order[key]
      }
      if (order[key] instanceof BigNumber) {
        fieldValue = order[key].toString().toLowerCase()
      } else {
        fieldValue = order[key]
      }
      textFields.push(
        <TextField
          id={key}
          key={key}
          label={this.renderLabel(key, fieldValue)}
          InputLabelProps={{
            shrink: true
          }}
          // placeholder={element.type}
          onChange={this.onTextFieldChange}
          fullWidth
          margin="normal"
          value={fieldValue}
        />
      )
    }
    return textFields
  }

  render() {
    return (
      <FormControl fullWidth={true} error={this.error}>
        {this.renderInputFields()}
        <FormHelperText>{this.state.errorMsg}</FormHelperText>
        <Button
          variant="contained"
          color="primary"
          onClick={this.props.onSignOrder}
        >
          Sign
        </Button>
      </FormControl>
    )
  }
}

export default OrderInputFields
