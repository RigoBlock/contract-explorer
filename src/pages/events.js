import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { FormControl, FormHelperText } from 'material-ui/Form';
import ReactJson from 'react-json-view'
import EventsFilters from '../elements/eventsFilters'
import { List } from 'immutable';
import Paper from 'material-ui/Paper';
import UploadButton from '../elements/uploadButton'
import ContractInputAddress from '../elements/contractInputAddress'
import Button from 'material-ui/Button';
import EventsValues from '../elements/eventsValues'
import Web3 from 'web3';
import { EP_RIGOBLOCK_KV_DEV_WS } from '../_utils/const'
import Sticky from 'react-stickynode';
import Loading from '../elements/loading';
import { dragoeventful } from '../abi'


class EventsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      abi: dragoeventful,
      methodSelected: {},
      eventsList: List([]),
      txError: '',
      json_object: {},
      contractAddress: "0xd5310e611b332febd046fff87f0e86428b758a93",
      gas: 0,
      enableContractAddressField: false,
      enableContractMethodsSelector: false,
      enableEventTopicField: true,
      topicsValues: ['AllEvents',
        '{ "from" : "0xec4ee1bcf8107480815b08b530e0ead75b9f804f" }',
        '{ "to" : "0xec4ee1bcf8107480815b08b530e0ead75b9f804f" }',
        '{ "drago" : "0xec4ee1bcf8107480815b08b530e0ead75b9f804f" }'],
      errorMsg: false, 
      errorMsgSubscribe: '',
      contractSubscription: null,
      loading: false
    };
  }
  
  
  static contextTypes = {web3: PropTypes.object.isRequired};

  componentWillUnmount() {
    this.unsubscribeFromEvent()
  }

  unsubscribeFromEvent = () => {
    const { contractSubscription } = this.state
    // unsubscribes the subscription
    if (contractSubscription) {
      contractSubscription.unsubscribe(function (error, success) {
        if (success)
          console.log('Successfully unsubscribed!');
      });
    }
  }

  onSubscribeEvents = () => {
    const { contractAddress, abi, topicsValues } = this.state
    this.setState({
      loading: true
    })
    // Clear existing subscription
    this.unsubscribeFromEvent()
    

    // Web3 subscriptions are available only on WebSocket
    const web3 = new Web3(EP_RIGOBLOCK_KV_DEV_WS)

    var dragoPadded = web3.utils.padLeft("0x36c3057Ce3de417677cFDFE918F77Bf075cDBe22", 64)
    console.log(dragoPadded)
    //var subscription = web3.eth.subscribe('newBlockHeaders', this.onNewBlockNumber)
    const contract = new web3.eth.Contract(abi, contractAddress)
    console.log(abi)
    var event = abi.find(function(element) {
      return (element.name === "DragoCreated" && element.type === "event");
    });
    console.log(event.signature)
    var filters = {}
    var topics = [...topicsValues]
    const eventsName = topics.shift()
    console.log(eventsName)
    console.log(topics)
    topics.map(element =>{
      console.log(element)
      var json = JSON.parse(element)
      filters = {...filters, ...json}
      console.log(filters)
    })
    contract.getPastEvents('AllEvents', {
      // filter: filters,
      fromBlock: 0,
      toBlock: 'latest',
      topics: [event.signature, null, null, null]
    })
    .then(events => {
      const eventsList = events.reverse()
      console.log(events)
      this.setState({
        loading: false,
        json_object: eventsList
      })
    })
    .then(() =>{
      // For more info please refer to the docs: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#events-allevents
      const subscription = contract.events.allEvents({
        fromBlock: "latest"
      }, this.onNewEvent)
      // ************************************
      //
      // Alternativelly we can do as follows
      //
      // ************************************
      // .on('data', event => {
      //   console.log(event); 
      // })
      // .on('changed', event => {
      //   console.log(event) 
      // })
      // .on('error', error =>{
      //   console.log(error)
      // });
      this.setState({
        contractSubscription: subscription
      })
      return true
      })
      .catch(error => {
        console.log(error)
        this.setState({
          json_object: { error: String(error) },
          loading: false
        })
      })
  }

  onNewEvent = (error, events) =>{
    // Adding the new event to the event list.
    const { json_object } = this.state
    var newEventsList = [...json_object]
    newEventsList.unshift(events) 
    this.setState({
      json_object: newEventsList
    })
  }

  onUpload = (file, text) =>{
    const uploadedAbi = JSON.parse(text)
    this.setState({
      abi: uploadedAbi,
      eventsList: List(uploadedAbi).sortBy(method => method.name).filter(method => method.type === 'event' ),
      enableContractAddressField: true,
      enableContractMethodsSelector: true,
    })
  }
  
  onChangeContractAddress = event => {
    this.setState({
      contractAddress: event.target.value,
    });
  };

  onChangeTopic = event => {
    console.log(event.target.id)
    var topicsValues = [...this.state.topicsValues]
    topicsValues[event.target.id] = event.target.value
    console.log(topicsValues)
    this.setState({
      topicsValues: topicsValues,
    });
  };

  render() {
    const containerWrapperStyle = {
      paddingRight: 5,
      paddingLeft: 5,
    }

    const containerGroupWrapperStyle = {
      paddingBottom: 15,
    }

    const paperStyle = {
      padding: 10,
      width: "100%"
    }

    return (
      <Grid container spacing={8} style={containerWrapperStyle}>
        <Grid item xs={12}>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={4}>
              <Grid container spacing={8} style={containerGroupWrapperStyle}>
                <Grid item xs={12}>
                  <Typography variant="headline" >
                    CONTRACT
                </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Paper style={paperStyle} elevation={2}>
                    <Grid item xs={12}>
                      <UploadButton onUpload={this.onUpload} />
                    </Grid>
                    <Grid item xs={12}>
                      <ContractInputAddress
                        onChangeContractAddress={this.onChangeContractAddress}
                        contractAddress={this.state.contractAddress}
                        enableContractAddressField={this.state.enableContractAddressField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth={true} error={this.state.errorSubscribe} >
                        <Button
                          variant="raised" component="span" color="primary"
                          onClick={this.onSubscribeEvents}
                          disabled={Object.keys(this.state.abi).length === 0 && this.state.abi.constructor === Object}
                          >
                          Subscribe
                      </Button>
                        <FormHelperText>{this.state.errorMsgSubscribe}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={8} style={containerGroupWrapperStyle}>
                <Grid item xs={12}>
                  <Typography variant="headline" >
                    VARIABLES
                </Typography>
                </Grid>
                <Grid item xs={12}>
                  {Object.keys(this.state.abi).length === 0 && this.state.abi.constructor === Object
                    ? null
                    : <EventsValues
                      eventsList={this.state.eventsList}
                    />
                  }
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Sticky>
                <Grid container spacing={8} style={containerGroupWrapperStyle}>
                  <Grid item xs={12}>
                    <Typography variant="headline" >
                      FILTERS
                      </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper style={paperStyle} elevation={2}>
                      <Grid item xs={12}>
                        <EventsFilters
                          onChangeTopic={this.onChangeTopic}
                          topicsValues={this.state.topicsValues}
                          enableEventTopicField={this.state.enableEventTopicField}
                        />
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid container spacing={8} style={containerGroupWrapperStyle}>
                  <Grid item xs={12}>
                    <Typography variant="headline" >
                      EVENTS
                  </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper style={paperStyle} elevation={2}>
                      {this.state.loading
                        ? <Loading />
                        : <ReactJson
                          src={this.state.json_object}
                          style={{ padding: "5px" }}
                          theme="codeschool"
                          indentWidth="2"
                          collapsed="1"
                        />
                      }
                    </Paper>
                  </Grid>
                </Grid>
              </Sticky>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default EventsPage;