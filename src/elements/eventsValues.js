import Grid from '@material-ui/core/Grid'
import JsonView from '../elements/jsonView'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import utils from '../_utils/utils'

class EventsValues extends Component {
  static propTypes = {
    eventsList: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    let stateUpdate = true
    let propsUpdate = true
    // shouldComponentUpdate returns false if no need to update children, true if needed.
    propsUpdate = !utils.shallowEqual(this.props, nextProps)
    stateUpdate = !utils.shallowEqual(this.state, nextState)
    return stateUpdate || propsUpdate
  }

  renderEvents = () => {
    const { eventsList } = this.props
    return eventsList.map((element, index) => {
      return (
        <Grid item xs={12} key={element.name + index}>
          <Typography variant="body1" gutterBottom>
            {element.name}
          </Typography>
          <JsonView key={index} json_object={element.inputs} />
        </Grid>
      )
    })
  }

  render() {
    const paperStyle = {
      padding: 10
    }
    return (
      <Paper style={paperStyle} elevation={2}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              EVENTS PARAMETERS
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8}>
              {this.renderEvents()}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default EventsValues
