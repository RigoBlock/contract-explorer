import React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: this.props.location.pathname,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleChange = (event, value) => {
    this.setState({
      tabSelected: value,
    });
    this.props.history.push(value);
  };

  render() {
    return (
      <div>
        <AppBar position="static">
          <Tabs
            value={this.state.tabSelected}
            onChange={this.handleChange}
          >
            <Tab label="Home" value="/" />
            {/* <Tab label="Drago Events" value="/drago-eventful" /> */}
            <Tab label="Vault Events" value="/vault-eventful" />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(TopBar);