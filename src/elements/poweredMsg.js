import PropTypes from 'prop-types'
import React, { Component } from 'react'

class PoweredMsg extends Component {
  static propTypes = {
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  render() {
    return (
      <div className="powered-link" style={this.props.style}>
        Powered by{' '}
        <a
          href="https://rigoblock.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Rigoblock
        </a>
      </div>
    )
  }
}

export default PoweredMsg
