import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Endpoint from '../_utils/endpoint';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import PoolApi from '../PoolsApi/src'
import Api from '@parity/api'
import Web3 from 'web3'
import { BigNumber } from '@0xproject/utils';
// import createOcean from 'the-ocean-x'

import {HttpClient} from '@0xproject/connect';
import { Aqueduct } from 'aqueduct';
import JsonView from '../elements/jsonView'

// 0x stuff
import * as Web3ProviderEngine from 'web3-provider-engine';
import * as RPCSubprovider from 'web3-provider-engine/subproviders/rpc';
import { InjectedWeb3Subprovider } from '@0xproject/subproviders';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import {ZeroEx} from '0x.js';


class Exchange extends React.Component {

  constructor(props) {
    super(props)
    // console.log(window.web3.currentProvider)
    this.state = {
      json_object: {},
      signedOrder: {},
      takerAddress: "0xc8dcd42e846466f2d2b89f3c54eba37bf738019b"
    };

    // const ocean = createOcean({
    //   api: {
    //     key: '1a886aa28ff413bafe310e32dae7e590',
    //     secret: '0bba7af67d68bbfbb16e6c12bfc78327d6a25ca361411e68bc19c0c850510f8a'
    //   },
    //   web3Provider: window.web3.currentProvider

    // })
    // this._ocean = ocean
    // console.log(ocean)
    // this.zeroEx = new ZeroEx(window.web3.currentProvider);
  }

  async onGetOrderBook() {
    // const ocean = this._ocean
    // const pairs = await ocean.marketData.tokenPairs();
    // console.log(pairs);    
    const httpClient = new HttpClient('https://api.amadeusrelay.org/api/v0/');
    httpClient.getTokenPairsAsync()
    .then(results => {
      console.log(results)
    })
    httpClient.getOrdersAsync({ makerTokenAddress: "0xd0a1e359811322d97991e03f863a0c30c2cf029c"})
    .then(results =>{
      console.log('Amadeus relay:')
      console.log(results)
      this.setState({
        json_object: results
      })
    })

    // Aqueduct.Initialize();

    // console.log(Aqueduct)

    // const orders = await new Aqueduct.Api.OrdersService().get({
    //   networkId: 1
    // });

    // console.log(orders);

    // const networks = await new Aqueduct.Api.NetworksService().getSupported()

    // console.log(networks);

  }

    /**
     * A baseUnit is defined as the smallest denomination of a token. An amount expressed in baseUnits
     * is the amount expressed in the smallest denomination.
     * E.g: 1 unit of a token with 18 decimal places is expressed in baseUnits as 1000000000000000000
     * @param   amount      The amount of units that you would like converted to baseUnits.
     * @param   decimals    The number of decimal places the unit amount has.
     * @return  The amount in baseUnits.
     */
    toBaseUnitAmount = function (amount, decimals) {
      // assert_1.assert.isBigNumber('amount', amount);
      // assert_1.assert.isNumber('decimals', decimals);
      var unit = new BigNumber(10).pow(decimals);
      var baseUnitAmount = amount.times(unit);
      var hasDecimals = baseUnitAmount.decimalPlaces() !== 0;
      if (hasDecimals) {
          throw new Error("Invalid unit amount: " + amount.toString() + " - Too many decimal places");
      }
      return baseUnitAmount;
  };

  async prepareOrder(){
    const KOVAN_NETWORK_ID = 42;
    const DECIMALS = 18;
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID,
      // exchangeContractAddress: "0x49489ce5d855e5a2cd53b9ae3ad1d5e0911d0bcb"
    }
    // Create a Web3 Provider Engine
    const providerEngine = new Web3ProviderEngine();
    // Compose our Providers, order matters
    // Use the InjectedWeb3Subprovider to wrap the browser extension wallet
    // All account based and signing requests will go through the InjectedWeb3Subprovider
    providerEngine.addProvider(new InjectedWeb3Subprovider(window.web3.currentProvider));
    // Use an RPC provider to route all other requests
    providerEngine.addProvider(new RPCSubprovider({ rpcUrl: 'https://srv03.endpoint.network:8545' }));
    providerEngine.start();

    console.log(this.state)
    // Setting unlimited allowance for ZRX token for taker address
    var zeroEx = new ZeroEx(providerEngine, ZeroExConfig);
    console.log(zeroEx)
    // const setZrxAllowanceTxHashes = await zeroEx.token.setUnlimitedProxyAllowanceAsync(this.state.signedOrder.takerTokenAddress, this.state.takerAddress)
    // console.log('Allowance set')
    // console.log(setZrxAllowanceTxHashes)
    // const ethAmount = new BigNumber(1);
    // console.log(ethAmount)
    // const ethToConvert = toBaseUnitAmount(ethAmount, DECIMALS); // Number of ETH to convert to WETH
    const orderAmount = new BigNumber(0.01)
    console.log(orderAmount)
    const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(orderAmount, DECIMALS);
    console.log(fillTakerTokenAmount)
    const txHash = await zeroEx.exchange.fillOrderAsync(this.state.signedOrder, new BigNumber(fillTakerTokenAmount), true, this.state.takerAddress);
    return zeroEx.awaitTransactionMinedAsync(txHash);
  }

  onSubmitOrder = () =>{
    this.prepareOrder()
    .then(console.log())
  }

  onGetAmadeusOrderBook = () => {
    const httpClient = new HttpClient('https://api.amadeusrelay.org/api/v0/');
    httpClient.getTokenPairsAsync()
    .then(results => {
      console.log(results)
    })
    httpClient.getOrdersAsync({ makerTokenAddress: "0xd0a1e359811322d97991e03f863a0c30c2cf029c"})
    .then(results =>{
      console.log('Amadeus relay:')
      console.log(results)
      this.setState({
        json_object: results
      })
      return results
    })
    .then(results =>{
      const order = results[2]
      const signedOrder = {
        maker: order.maker,
        taker: order.taker,
        makerFee: new BigNumber(order.makerFee),
        takerFee: new BigNumber(order.takerFee),
        makerTokenAmount: order.makerTokenAmount,
        takerTokenAmount: order.takerTokenAmount,
        makerTokenAddress: order.makerTokenAddress,
        takerTokenAddress: order.takerTokenAddress,
        ecSignature: order.ecSignature,
        salt: order.salt,
        exchangeContractAddress: order.exchangeContractAddress,
        expirationUnixTimestampSec: new BigNumber(order.expirationUnixTimestampSec),
        feeRecipient: order.feeRecipient
      }
      this.setState({
        signedOrder: signedOrder
      })
    })
  }


  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <FormControl fullWidth={true}>
            <Button variant="raised" onClick={this.onGetAmadeusOrderBook}>
              Get Amadeus Order Book
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="headline" >
            ORDER TO BE SUBMITTED
          </Typography>
          <FormControl fullWidth={true}>
            <Button variant="raised" onClick={this.onSubmitOrder}>
              SUBMIT
            </Button>
          </FormControl>
          <JsonView
            json_object={[this.state.signedOrder]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="headline" >
            ORDERS
              </Typography>
          <JsonView
            json_object={[...this.state.json_object]}
          />
        </Grid>
        {/* <Grid item xs={12}>
        <br />
          <FormControl fullWidth={true}>
            <Button variant="raised" onClick={this.sellDrago}>
              Sell Drago
          </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
        <br />
          <FormControl fullWidth={true}>
            <Button variant="raised" onClick={this.getDragoDetails}>
              Get Drago Data
          </Button>
          </FormControl>
        </Grid> */}
      </Grid>
    );
  }
}

export default Exchange;