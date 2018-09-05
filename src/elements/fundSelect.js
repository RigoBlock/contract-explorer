import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import PoweredMsg from './poweredMsg'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select from '@material-ui/core/Select'

class FundSelect extends Component {
  static propTypes = {
    fundsList: PropTypes.array.isRequired,
    onFundSelect: PropTypes.func.isRequired,
    fundSelected: PropTypes.object
  }

  static defaultProps = {
    fundSelected: {
      address: ''
    }
  }

  onFundSelect = event => {
    this.props.onFundSelect(event)
    // this.setState({ fundSelected: event.target.value });
  }

  renderSelectItems = () => {
    const { fundsList } = this.props
    return fundsList.map(element => {
      return (
        <MenuItem key={element.details.id} value={element.address}>
          {element.details.name}
          &nbsp;-&nbsp;
          <small>{element.address}</small>
        </MenuItem>
      )
    })
  }

  render() {
    const { fundSelected, fundsList } = this.props
    return (
      <FormControl fullWidth={true} disabled={fundsList.length === 0}>
        {/* <InputLabel htmlFor="fund-select">Your funds</InputLabel> */}

        <Select
          value={fundSelected.address}
          displayEmpty
          // name="Your Rigoblock fund"
          onChange={this.onFundSelect}
          input={<Input name="fund" id="fund-select" />}
        >
          <MenuItem key={'nofund'} value={''}>
            Use personal account
          </MenuItem>
          {this.renderSelectItems()}
          <PoweredMsg style={{ opacity: 0.7, marginRight: '5px' }} />
        </Select>
      </FormControl>
    )
  }
}

export default FundSelect
