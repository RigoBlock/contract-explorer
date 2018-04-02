import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';

class EventsFilters extends Component {

  static contextTypes = {web3: PropTypes.object.isRequired};

  static propTypes = {
    enableEventTopicField: PropTypes.bool.isRequired,
    onChangeTopic:PropTypes.func.isRequired,
    topicsValues:PropTypes.array.isRequired,
    fromBlock: PropTypes.number
  }

  onChangeTopic = event => {
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
      <div>
        <FormControl >
            <TextField
              label="From"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder='0'
              helperText="The block number from which to get events on."
            />
            <TextField
              label="To"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder='latest'
              helperText='The block number to get events up to (Defaults to "latest").'
            />
          </FormControl>
          <FormControl fullWidth={true}>
            <TextField
              label="Filters"
              id="margin-none"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder='{ "param1" : "string", "param2" : "string" }'
              helperText="The filter to apply. Must be an object"
            />
          </FormControl>
          <FormControl fullWidth={true}>
              {this.renderTopicsFields(this.props.topicsValues)}
          </FormControl>
        </div>
    );
  }
}

export default EventsFilters;