import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { FormControl, FormHelperText } from 'material-ui/Form';
import ReactJson from 'react-json-view'
import { dragoeventful } from '../abi'
import EventsInputTopics from '../elements/eventsInputTopics'
import { List } from 'immutable';
import Paper from 'material-ui/Paper';
import UploadButton from '../elements/uploadButton'
import ContractInputAddress from '../elements/contractInputAddress'
import Button from 'material-ui/Button';
import EventsValues from '../elements/eventsValues'
import Web3 from 'web3';


class EventsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      abi: List(dragoeventful).sortBy(method => method.name).filter(method => method.type === 'event' ),
      methodSelected: {},
      txHash: '0x1a42f43c8f46e99faeb4a3c9e6d155d101da2106ef7dcc49ef2f874b058e3c5f',
      txError: '',
      json_object: {},
      contractAddress: "0xd5310e611b332febd046fff87f0e86428b758a93",
      gas: 0,
      uploadedAbi: {},
      enableContractAddressField: false,
      enableContractMethodsSelector: false,
      enableEventTopicField: true,
      topicsValues: ['','','',''],
      errorMsg: false, 
      errorMsgSubscribe: '',
      contractSubscription: null
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
    const { contractAddress } = this.state

    // Clear existing subscription
    this.unsubscribeFromEvent()

    // Web3 subscriptions are available only on WebSocket
    const web3 = new Web3('wss://srv03.endpoint.network:8546')
    //var subscription = web3.eth.subscribe('newBlockHeaders', this.onNewBlockNumber)
    const contract = new web3.eth.Contract(dragoeventful, contractAddress)
    contract.getPastEvents('BuyDrago', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    .then(events => {
      const eventsList = events.reverse()
      this.setState({
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
      uploadedAbi,
      enableContractAddressField: true,
      enableEventTopicField: true,
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
                      <FormControl fullWidth={true} error={this.state.errorSubscribe}>
                        <Button
                          variant="raised" component="span" color="primary"
                          onClick={this.onSubscribeEvents}>
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
                  {/* <EventsValues
                    abi={this.state.abi}
                  /> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={8} style={containerGroupWrapperStyle}>
                <Grid item xs={12}>
                  <Typography variant="headline" >
                    TOPICS
                </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Paper style={paperStyle} elevation={2}>
                    <Grid item xs={12}>
                      <EventsInputTopics
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
                    <ReactJson
                      src={this.state.json_object}
                      style={{ padding: "5px" }}
                      theme="codeschool"
                      indentWidth="2"
                      collapsed="1"
                    />
                  </Paper>
                </Grid>



              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default EventsPage;