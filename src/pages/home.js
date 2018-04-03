import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

class HomePage extends React.Component {

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="display1" gutterBottom align='center'>
            ABI Explorer
          </Typography>
          <Typography gutterBottom >
            A simple dev tool to interact with Smart Contracts and events. This application is connected to Ethereum Kovan network.
          </Typography>
          <Typography gutterBottom>
            <strong>Please make sure your MetaMask is unlocked to get access to the CONTRACTS and EVENTS pages.</strong>
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