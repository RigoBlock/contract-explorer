import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

class EventsFilters extends Component {

  constructor(props) {
    super(props)
    this.state = {
      topics: Array.apply(null, Array(4)).map(function () { return ""}),
      // topics: [
      //   'DragoCreated, BuyDrago',
      //   '0xec4ee1bcf8107480815b08b530e0ead75b9f804f',
      //   '0xec4ee1bcf8107480815b08b530e0ead75b9f804f',
      //   '0xec4ee1bcf8107480815b08b530e0ead75b9f804f'
      // ],
      prevProps: this.props,
      // filters: '"myNumber": "[12,13]"',
      filters: '',
      blockFrom: "0",
      blockTo: "latest",
      error: false,
      errorMsg: ''
    };
  }

  static contextTypes = {web3: PropTypes.object.isRequired};

  static propTypes = {
    enableEventTopicField: PropTypes.bool.isRequired,
    onSubscribeEvents: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  }

  onChangeFilters = event => {
    const { topics } = this.state
    const newTopics = [...topics]

    switch (event.target.id) {
      case "blockFrom":
        this.setState({
          blockFrom: event.target.value
        })
        break;
      case "blockTo":
        this.setState({
          blockTo: event.target.value
        })
        break;
      case "filters":
        this.setState({
          filters: event.target.value
        })
        break;
      default:
        newTopics[event.target.id] = event.target.value
        this.setState({
          topics: newTopics
        })
    }
  };

  onSubscribeEvents = () => {
    const { blockFrom, blockTo, filters, topics } = this.state
    var filtersObject
    var topicsArray
    try {
      filtersObject = JSON.parse("{"+filters+"}");
    }
    catch(error) {
      console.log(error);
    }

    topicsArray = topics.map( (topic) => {
      return topic.replace(/\s/g, '').split(',');
    })
    this.props.onSubscribeEvents(blockFrom, blockTo, filtersObject, topicsArray)

  }

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
          placeholder={`var${key}, var${key+1}`}
          onChange={this.onChangeFilters}
          fullWidth
          margin="normal"
          value={this.state.topics[key]}
          disabled={!this.props.enableEventTopicField}
          helperText="Must be comma separated list or empty."
        />
      )
    })
  }

  render() {
    const formStyles = {
      formControl: {
        paddingBottom: "10px"
      }
    }
    return (
      <div>
        <FormControl fullWidth={true} style={formStyles.formControl}>
          <Button
            variant="raised"
            color="primary"
            onClick={this.onSubscribeEvents}
            disabled={!this.props.enableEventTopicField}
          >
            Subscribe
          </Button>
        </FormControl>

        <FormControl style={formStyles.formControl}>
            <TextField
              label="From"
              id="blockFrom"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder='0'
              helperText="The block number from which to get events on."
              value={this.state.blockFrom}
              onChange={this.onChangeFilters}
              disabled={!this.props.enableEventTopicField}
            />
          </FormControl>
          <FormControl style={formStyles.formControl}>
            <TextField
              label="To"
              id="blockTo"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder='latest'
              helperText='The block number to get events up to (Defaults to "latest").'
              value={this.state.blockTo}
              onChange={this.onChangeFilters}
              disabled={!this.props.enableEventTopicField}
            />
          </FormControl>
          <FormControl fullWidth={true} style={formStyles.formControl}>
            <TextField
              label="Filters"
              id="filters"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder='"param1" : "string", "param2" : "string"'
              helperText="Must be comma separated list or empty."
              value={this.state.filters}
              onChange={this.onChangeFilters}
              disabled={!this.props.enableEventTopicField}
            />
          </FormControl>
          <FormControl fullWidth={true} style={formStyles.formControl}>
              {this.renderTopicsFields(this.state.topics)}
          </FormControl>
        </div>
    );
  }
}

export default EventsFilters;