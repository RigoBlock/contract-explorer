import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';

class EventsInputTopics extends Component {

  static contextTypes = {web3: PropTypes.object.isRequired};

  static propTypes = {
    enableEventTopicField: PropTypes.bool.isRequired,
    onChangeTopic:PropTypes.func.isRequired,
    topicsValues:PropTypes.array.isRequired,
  }

  onChangeTopic = event => {
    const { web3 } = this.context
    if (web3.utils.isAddress(event.target.value)) {
      this.setState({
        error: false,
        errorMsg: ''
      })
    } else {
      this.setState({
        error: true,
        errorMsg: 'Invalid address'
      })
    }
    this.props.onChangeTopic(event)
  };

  renderTopicsFields = (topics) => {
    return topics.map((topic, key) => {
      return (
        <TextField
          key={key}
          label={`Topic ${key}`}
          id={`${key}`}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={`Topic ${key}`}
          onChange={this.onChangeTopic}
          fullWidth
          margin="normal"
          value={this.props.topicsValues[key]}
          disabled={!this.props.enableEventTopicField}
        />
      )
    })
  }

  render() {
    return (
      <FormControl fullWidth={true}>
        {this.renderTopicsFields(this.props.topicsValues)}
      </FormControl>
    );
  }
}

export default EventsInputTopics;