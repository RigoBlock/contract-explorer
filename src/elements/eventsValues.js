import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactJson from 'react-json-view'
import Typography from 'material-ui/Typography';

class EventsValues extends Component {

  static propTypes = {
    abi: PropTypes.object.isRequired,
  };

  renderEvents = () => {
    const { abi } = this.props
    return abi.map((element, index) => {
      return (
        <Grid item xs={12} key={element.name + index}>
          <Typography variant="body2" gutterBottom>
            {element.name}
          </Typography>
          <ReactJson
            key={index}
            src={element.inputs}
            style={{ padding: "5px" }}
            theme="codeschool"
            indentWidth="2"
            collapsed="2"
          />
        </Grid>
      )
    }
    )
  }

  render() {
    const paperStyle = {
      padding: 10,
    }
    console.log(this.props.abi)
    return (
      <Paper style={paperStyle} elevation={2}>
        <Grid container spacing={8} >
          <Grid item xs={12}>
            <Typography variant="subheading" gutterBottom>
              EVENTS PARAMETERS
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8} >
              {this.renderEvents()}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default EventsValues;