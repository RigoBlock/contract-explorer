import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from '../withRoot';
import VaultEventfulPage from './vaultEventful';
import HomePage from './home';
import Web3 from 'web3';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 5,
  },
});

class Index extends React.Component {

  static childContextTypes = {
    web3: PropTypes.object
  };

  getChildContext() {
    return {web3: this.state.web3};
  }

  componentWillMount () {
    
    var web3
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {

      // Use the browser's ethereum provider
      web3 = new Web3(window.web3.currentProvider)

    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
    this.setState({web3});
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/vault-eventful' component={VaultEventfulPage} />
          {/* <Route path='/contact' component={Contact} /> */}
          {/* when none of the above match, <NoMatch> will be rendered */}
          {/* <Route component={NoMatch} /> */}
        </Switch>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(Index));
