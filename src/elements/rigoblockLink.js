import PropTypes from 'prop-types'
import React, { Component } from 'react'

class RigoblockLink extends Component {
  static propTypes = {
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  render() {
    return (
      <a
        href="https://beta.rigoblock.com/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Rigoblock
      </a>
    )
  }
}

export default RigoblockLink
