import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import JsonView from '../elements/jsonView'

class InOutMethodValues extends Component {

  static propTypes = {
    methodSelected: PropTypes.object.isRequired,
  };

  render() {
    const { methodSelected } = this.props;
    const paperStyle = {
      padding: 10,
    }
    if (typeof methodSelected.inputs !== 'undefined') {
      return (
        <Paper style={paperStyle} elevation={2}>
          <Grid container spacing={8} >
            <Grid item xs={12}>
              <Typography variant="subheading" gutterBottom>
                INPUTS
            </Typography>
            </Grid>
            <Grid item xs={12}>
              <JsonView 
                json_object={methodSelected.inputs}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subheading" gutterBottom>
                OUTPUTS
            </Typography>
            </Grid>
            <Grid item xs={12}>
              <JsonView 
                json_object={methodSelected.outputs}
              />
            </Grid>
          </Grid>
        </Paper>
      )
    } else{
      return null
    }

  }
}

export default InOutMethodValues;