import React from 'react';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress'

class Loading extends React.Component {

  render() {
    const containerGroupWrapperStyle = {
      paddingBottom: 15,
    }

    return (
      <Grid
        container spacing={8}
        style={containerGroupWrapperStyle}
        alignContent={'center'}
        alignItems={'center'}
        justify={'center'}>
        <Grid item xs={12} >
          <br />
          <LinearProgress />
        </Grid>
      </Grid>
    );
  }
}

export default Loading;