import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

class HomePage extends React.Component {

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="display1" gutterBottom>
            Home Page
          </Typography>
        </Grid>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    );
  }
}

export default HomePage;