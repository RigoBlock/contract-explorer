import React from 'react';
import ReactJson from 'react-json-view'
import PropTypes from 'prop-types';
import utils from '../_utils/utils'

class JsonView extends React.Component {

  static propTypes = {
    json_object: PropTypes.array.isRequired,
  };


  shouldComponentUpdate(nextProps, nextState){    
    var stateUpdate = true
    var propsUpdate = true
    // shouldComponentUpdate returns false if no need to update children, true if needed.
    propsUpdate = (!utils.shallowEqual(this.props, nextProps))
    stateUpdate = (!utils.shallowEqual(this.state, nextState))
    return stateUpdate || propsUpdate 
  }

  render() {
    return (
      <div>
        {/* {new Date().toString()} */}
        <ReactJson
          src={this.props.json_object}
          style={{ padding: "5px" }}
          theme="codeschool"
          indentWidth="2"
          collapsed="2"
        />
      </div>
    );
  }
}

export default JsonView;