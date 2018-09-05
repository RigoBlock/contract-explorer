import { MenuItem } from '@material-ui/core/Menu'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select from '@material-ui/core/Select'

class MethodSelect extends Component {
  state = {
    methodSelected: ''
  }

  static propTypes = {
    methodList: PropTypes.object.isRequired,
    onMethodSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  }

  onMethodSelect = event => {
    this.props.onMethodSelect(event)
    this.setState({ methodSelected: event.target.value })
  }

  renderMenuItems = () => {
    const { methodList } = this.props
    return methodList.map((element, index) => {
      return (
        <MenuItem key={element.name + index} value={element.name}>
          {element.name}
        </MenuItem>
      )
    })
  }

  render() {
    return (
      <FormControl fullWidth={true} disabled={this.props.disabled}>
        <InputLabel htmlFor="method-select">Method</InputLabel>
        <Select
          value={this.state.methodSelected}
          onChange={this.onMethodSelect}
          input={<Input name="method" id="method-select" />}
        >
          {this.renderMenuItems()}
        </Select>
      </FormControl>
    )
  }
}

export default MethodSelect
