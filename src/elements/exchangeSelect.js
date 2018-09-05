import EtherscanLink from '../elements/etherscanLink'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select from '@material-ui/core/Select'

class ExchangeSelect extends Component {
  static propTypes = {
    exchangeSelected: PropTypes.string.isRequired,
    exchangesList: PropTypes.object.isRequired,
    onExchangeSelect: PropTypes.func.isRequired
  }

  static contextTypes = {
    web3: PropTypes.object.isRequired,
    networkInfo: PropTypes.object.isRequired
  }

  onExchangeSelect = event => {
    this.props.onExchangeSelect(event.target.value)
    this.setState({ echangeSelected: event.target.value })
  }

  renderMenuItems = () => {
    const { exchangesList } = this.props
    let menuItems = Array()

    Object.keys(exchangesList).forEach(function(key, index) {
      menuItems.push(
        <MenuItem key={key + index} value={key}>
          {key}
        </MenuItem>
      )
    })
    return menuItems
  }

  render() {
    return (
      <div>
        <FormControl
          fullWidth={true}
          error={
            !this.props.exchangesList[this.props.exchangeSelected].needAllowance
          }
        >
          <InputLabel htmlFor="exchange-select">Exchange</InputLabel>
          <Select
            value={this.props.exchangeSelected}
            onChange={this.onExchangeSelect}
            input={<Input name="exchange" id="exchange-select" />}
          >
            {this.renderMenuItems()}
          </Select>
          <FormHelperText>
            {!this.props.exchangesList[this.props.exchangeSelected]
              .needAllowance && 'This exchange requires locking of tokens.'}
          </FormHelperText>
        </FormControl>

        <div style={{ marginTop: '10px' }}>
          Exchange contract address:{' '}
          <EtherscanLink
            address={
              this.props.exchangesList[this.props.exchangeSelected]
                .exchangeContractAddress
            }
          />
          <br />
          Fund transfer proxy address:{' '}
          <EtherscanLink
            address={
              this.props.exchangesList[this.props.exchangeSelected]
                .tokenTransferProxyContractAddress
            }
          />
        </div>
      </div>
    )
  }
}

export default ExchangeSelect
