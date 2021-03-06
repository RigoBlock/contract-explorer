// From https://github.com/nicolaslopezj/simple-react-form-material-ui/blob/master/src/file/upload-button.jsx

import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import _ from 'underscore'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import FormHelperText from '@material-ui/core/FormHelperText'

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
      return true
    })
    return true
  }

  validate_fileupload = (fileName) => {
    var allowed_extensions = new Array("json");
    var file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

    for(var i = 0; i <= allowed_extensions.length; i++)
    {
        if(allowed_extensions[i] === file_extension)
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
              variant="contained" component="span" color="primary"
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