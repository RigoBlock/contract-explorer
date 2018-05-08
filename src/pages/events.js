import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import EventsFilters from '../elements/eventsFilters'
import { List } from 'immutable';
import Paper from 'material-ui/Paper';
import UploadButton from '../elements/uploadButton'
import ContractInputAddress from '../elements/contractInputAddress'
import EventsValues from '../elements/eventsValues'
import Web3 from 'web3';
import { EP_RIGOBLOCK_KV_DEV_WS } from '../_utils/const'
import Sticky from 'react-stickynode';
import Loading from '../elements/loading';
import JsonView from '../elements/jsonView'
// import { dragoeventful } from '../abi'

class EventsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      abi: {},
      methodSelected: {},
      eventsList: List([]),
      txError: '',
      json_object: {},
      // contractAddress: "0xd5310e611b332febd046fff87f0e86428b758a93",
      contractAddress: "",
      gas: 0,
      enableContractAddressField: false,
      enableContractMethodsSelector: false,
      enableEventTopicField: false,
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

  onSubscribeEvents = (blockFrom, blockTo, filters, topics) => {
    const { contractAddress, abi } = this.state
    this.setState({
      loading: true
    })
    // Clear existing subscription
    this.unsubscribeFromEvent()
    
    // Web3 subscriptions are available only on WebSocket
    const web3 = new Web3(EP_RIGOBLOCK_KV_DEV_WS)
    var contract
    try {
      contract = new web3.eth.Contract(abi, contractAddress)
    }
    catch(error) {
      console.log(error);
      this.setState({
        json_object: { error: String(error) },
        loading: false
      })
      return
    }
    
    // Parsing topic[0]. topic[0] must contain the event singature. 
    var eventsSingatures = []
    topics[0].map((event, index) =>{
      abi.map(function(element) {
        if (element.name === event && element.type === "event") {
          return eventsSingatures[index] = element.signature
        }
        return true
      });
      return true
    })

    // Padding the other topics. Element in topics are expeted to be a 0x-prefixed, padded, hex-encoded hash with length 64.
    var topicsPadded = []
    topics.map((topic, index) => {
      topicsPadded[index] = topic.map((element) => {
        if (element !== "") {
          return web3.utils.padLeft(element, 64)
        } else {
          return null
        }
      }
      )
      return true
    })
    // Getting the past logs. topics must by an array of arrays. 
    // An item must be se to null if the topic is empty. Don't pass an array such as array = null.
    //
    // ATTENTION: filsters parameter seems to be buggy in the current wersion of Web3. Events are not filtered.

    contract.getPastEvents('allEvents', {
      filter: filters,
      fromBlock: blockFrom,
      toBlock: blockTo,
      topics: [
        eventsSingatures.length === 0 ? null: eventsSingatures,
        topicsPadded[1][0] === null ? null : topicsPadded[1],
        topicsPadded[2][0] === null ? null : topicsPadded[2],
        topicsPadded[3][0] === null ? null : topicsPadded[3]
      ]
    })
    .then(events => {
      const eventsList = events.reverse()
      this.setState({
        loading: false,
        json_object: eventsList
      })
    })
    .then(() =>{
      // For more info please refer to the docs: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#events-allevents
      const subscription = contract.events.allEvents({
        filter: filters,
        fromBlock:'latest',
        topics: [
          eventsSingatures.length === 0 ? null: eventsSingatures,
          topicsPadded[1][0] === null ? null : topicsPadded[1],
          topicsPadded[2][0] === null ? null : topicsPadded[2],
          topicsPadded[3][0] === null ? null : topicsPadded[3]
        ]
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

  onNewEvent = (error, event) =>{
    // Adding the new event to the event list.
    const { json_object } = this.state
    var newEventsList = [...json_object]
    newEventsList.unshift(event) 
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
      enableEventTopicField: true,
    })
  }
  
  onChangeContractAddress = event => {
    this.setState({
      contractAddress: event.target.value,
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
                    {/* <Grid item xs={12}>
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
                    </Grid> */}
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
                          onSubscribeEvents={this.onSubscribeEvents}
                          enableEventTopicField={this.state.enableEventTopicField}
                          disabled={Object.keys(this.state.abi).length === 0 && this.state.abi.constructor === Object}
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
                        : <JsonView
                          json_object={[...this.state.json_object]}
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