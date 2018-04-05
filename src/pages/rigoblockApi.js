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
import BigNumber from 'bignumber.js';
import { drago } from '../abi'


class RigoblockApi extends React.Component {

  constructor(props) {
    super(props)
    const networkInfo = {
      id: 42,
      name: "kovan",
      etherscan: "https://kovan.etherscan.io/"
    }
    const ENDPOINTS = {
      name: "rigoblock",
      https: {
        kovan: {
          dev: "https://srv03.endpoint.network:8545",
          prod: "https://kovan.endpoint.network:8545"
        },
        ropsten: {
          dev: "https://srv03.endpoint.network:8645",
          prod: "https://ropsten.endpoint.network:8645"
        },
        mainnet: {
          dev: "https://srv03.endpoint.network:8745",
          prod: "https://mainnet.endpoint.network:8745"
        },
      },
      wss: {
        kovan: {
          dev: "wss://srv03.endpoint.network:8546",
          prod: "wss://kovan.endpoint.network:8546"
        },
        ropsten: {
          dev: "wss://srv03.endpoint.network:8646",
          prod: "wss://ropsten.endpoint.network:8646"
        },
        mainnet: {
          dev: "wss://srv03.endpoint.network:8746",
          prod: "wss://mainnet.endpoint.network:8746"
        },
      }
      }
    
    var endpoint = new Endpoint(ENDPOINTS, networkInfo)
    this._api = endpoint.connect() // Returns a Parity API instance.

    const transport = new Api.Provider.Http('https://srv03.endpoint.network:8545', 1000)
    this._apiParity = new Api(transport)
  }

  buyDrago = () => {
    // Sending the transaction
    var poolApi
    var accountAddress
    const dragoAddress = '0xE3B53367ab7F9a3A1F82A3dAAb20f78121d1BB12'

    const web3 = new Web3(window.web3.currentProvider)

    // Setting _rb will not be necessary in Pools Api V3
    web3._rb = {
      network: {
        id: 42,
        name: "kovan",
        etherscan: "https://kovan.etherscan.io/"
      }
    }

    // Converting ETH to Wei.
    const ethAmount = "0.1" // 1 ETH
    const weiAmount = web3.utils.toWei(ethAmount).toString()

    // Getting MetaMask account
    web3.eth.getAccounts()
      .then((accounts) => {
        accountAddress = accounts[0]
      })
      .then(() => {
        poolApi = new PoolApi(web3)
        // Sending the transation
        poolApi.contract.drago.init(dragoAddress)
        poolApi.contract.drago.buyDrago(accountAddress, weiAmount)
          .then((receipt) => {
            console.log(receipt)
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .then (() =>{
        const web3Parity = new Web3('https://srv03.endpoint.network:8545')
        const contract = new web3Parity.eth.Contract(drago, dragoAddress)
        var options = {
          from: '0x00791547B03F5541971B199a2d347446eB8Dc9bE',
          value: web3.utils.toWei(ethAmount).toString()
        }
        web3Parity.eth.getAccounts()
        .then((accounts)=>{
          console.log(accounts)
        })
        contract.methods.buyDrago().estimateGas(options)
        .then(gasEstimate => {
          options.gas = gasEstimate
          contract.methods.buyDrago().send(options)
          .then(result => {
            console.log(result)
          })
        }
        
        )
      })
  }

  sellDrago = () => {
    // Sending the transaction
    var poolApi
    var accountAddress
    const dragoAddress = '0xE3B53367ab7F9a3A1F82A3dAAb20f78121d1BB12'

    const web3 = new Web3(window.web3.currentProvider)

    // Setting _rb will not be necessary in Pools Api V3
    web3._rb = {
      network: {
        id: 42,
        name: "kovan",
        etherscan: "https://kovan.etherscan.io/"
      }
    }

    // Converting ETH to Wei.
    const fundAmount = 0.1 // 1 Unit
    const DIVISOR = 10 ** 6;  //dragos are divisible by 1 million
    const amount = new BigNumber(fundAmount).multipliedBy(DIVISOR).toFixed(0)

    // Getting MetaMask account
    web3.eth.getAccounts()
      .then((accounts) => {
        accountAddress = accounts[0]
      })
      .then(() => {
        poolApi = new PoolApi(web3)
        // Sending the transation
        poolApi.contract.drago.init(dragoAddress)
        poolApi.contract.drago.sellDrago(accountAddress, amount)
          .then((receipt) => {
            console.log(receipt)
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  getDragoDetails = () => {

    var poolApi
    var accountAddress
    const dragoAddress = '0xE3B53367ab7F9a3A1F82A3dAAb20f78121d1BB12'
    const dragoId = "5"

    const web3 = new Web3(window.web3.currentProvider)
    const transport = new Api.Provider.Http('https://srv03.endpoint.network:8545', 1000)
    const parityApi = new Api(transport)

    // Setting _rb will not be necessary in Pools Api V3
    parityApi._rb = {
      network: {
        id: 42,
        name: "kovan",
        etherscan: "https://kovan.etherscan.io/"
      }
    }

    web3._rb = {
      network: {
        id: 42,
        name: "kovan",
        etherscan: "https://kovan.etherscan.io/"
      }
    }


    //
    // Initializing Drago API
    // Passing Parity API
    //      

    poolApi = new PoolApi(parityApi)
    console.log(poolApi.contract)
    //
    // Initializing registry contract
    //
    web3.eth.getAccounts()
      .then((accounts) => {
        accountAddress = accounts[0]
      })
      .then(() => {
        poolApi.contract.dragoregistry
          .init()
          .then(() => {
            //
            // Looking for drago from dragoId
            //
            poolApi.contract.dragoregistry
              .fromId(dragoId)
              .then((dragoDetails) => {
                const dragoAddress = dragoDetails[0][0]

                //
                // Initializing drago contract
                //
                poolApi.contract.drago.init(dragoAddress)

                //
                // Calling getData method
                //
                poolApi.contract.drago.getData()
                  .then((data) => {
                    //
                    // Gettin balance for account
                    //
                    console.log(data)
                    poolApi.contract.drago.balanceOf(accountAddress)
                    .then (balance => {
                      console.log(balance)
                    })
                  })
              })
              .then(() => {
                poolApi.contract.dragoeventful.init()
                  .then(() => {
                    const eventsFilterCreated = {
                      topics: [
                        [poolApi.contract.dragoeventful.hexSignature.DragoCreated],
                        dragoAddress,
                        null,
                        null
                      ]
                    }
                    poolApi.contract.dragoeventful
                      .getAllLogs(eventsFilterCreated)
                      .then((dragoTransactionsLog) => {
                        console.log(dragoTransactionsLog)
                      }
                      )
                  })
                }
              )

          })
      }) 
}

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <FormControl fullWidth={true}>
            <Button variant="raised" onClick={this.buyDrago}>
              Buy Drago
          </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    );
  }
}

export default RigoblockApi;