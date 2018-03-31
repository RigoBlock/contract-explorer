// From https://github.com/nicolaslopezj/simple-react-form-material-ui/blob/master/src/file/upload-button.jsx

import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import _ from 'underscore'
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

class UploadButton extends Component {

  state = {
    error: false
  }

  static propTypes = {
    accept: PropTypes.string,
    label: PropTypes.any,
    multi: PropTypes.bool,
    onUpload: PropTypes.func.isRequired,
    passText: PropTypes.bool
  }

  static defaultProps = {
    label: 'Upload Abi',
    multi: false,
    accept: null,
    passText: true,
    error: false,
    errorMsg: ''
  }

  openFileDialog () {
    var fileInputDom = ReactDOM.findDOMNode(this.refs.input)
    fileInputDom.click()
  }

  handleFile (event) {
    _.keys(event.target.files).map((index) => {
      const file = event.target.files[index]
      console.log(file)
      if (!this.validate_fileupload(file.name)) {
        this.setState({
          error: true,
          errorMsg: 'Invalid file type. Please upload a json file.'
        })
        return false
      }
      if (this.props.passText) {
        const reader = new FileReader()
        reader.onload = (upload) => {
          const text = upload.target.result
          this.props.onUpload(file, text)
        }
        reader.readAsText(file)
        this.setState({
          error: false,
          errorMsg: 'Upload successful.'
        })
      } else {
        this.props.onUpload(file)
      }
    })
  }

  validate_fileupload = (fileName) => {
    var allowed_extensions = new Array("json");
    var file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

    for(var i = 0; i <= allowed_extensions.length; i++)
    {
        if(allowed_extensions[i]==file_extension)
        {
            return true; // valid file extension
        }
    }
    return false;
  }

  render () {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <FormControl fullWidth={true} error={this.state.error}>
            <Button
              variant="raised" component="span" color="primary"
              onClick={this.openFileDialog.bind(this)}>
              {this.props.label}
            </Button>
            <input
              type='file'
              multiple={this.props.multi}
              ref='input'
              style={{ display: 'none' }}
              accept={this.props.accept}
              onChange={this.handleFile.bind(this)} />
              <FormHelperText>{this.state.errorMsg}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

}



export default UploadButton;