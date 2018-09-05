import PropTypes from 'prop-types'
import React, { Component } from 'react'

class EtherscanLink extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired
  }

  static contextTypes = {
    networkInfo: PropTypes.object.isRequired
  }

  render() {
    const url = {
      3: 'ropsten.etherscan.io/address',
      42: 'kovan.etherscan.io/address'
    }
    return (
      <a
        href={`https://${
          url[this.context.networkInfo.id]
        }/${this.props.address.toLowerCase()}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {this.props.address.toLowerCase()}
      </a>
    )
  }
}

export default EtherscanLink
