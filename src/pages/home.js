import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';

class HomePage extends React.Component {
  render() {
    const paperStyle = {
      padding: 10,
      margin: 10
    }
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="display1" gutterBottom align="center">
            ABI EXPLORER
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper style={paperStyle} elevation={2}>
            <Typography gutterBottom>
              A simple dev tool to interact with Smart Contracts and events.
              This application is connected to Ethereum <strong>Kovan</strong>{' '}
              network.
            </Typography>
            <Typography gutterBottom>
              <strong>Please make sure your MetaMask is unlocked.</strong>
            </Typography>
            <Typography gutterBottom>
              <strong>&nbsp;</strong>
            </Typography>
            <Typography gutterBottom>
              <strong>CONTRACTS:</strong> a tool for testing Smart Contracts.
            </Typography>
            <Typography gutterBottom>
              <strong>EVENTS:</strong> a tool for reading events emitted by
              Smart Contracts.
            </Typography>
            <Typography gutterBottom>
              <strong>ZEROEX:</strong> a tool for creating and validating{' '}
              <a
                href="https://0xproject.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                ZeroEx
              </a>{' '}
              orders.
            </Typography>
            <Typography gutterBottom>
              <strong>&nbsp;</strong>
            </Typography>
            <Typography gutterBottom>
              By David Fava @{' '}
              <a
                href="https://RigoBlock.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                RigoBlock.com
              </a>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} />
      </Grid>
    )
  }
}

export default HomePage
