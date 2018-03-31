import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/index';
import { BrowserRouter } from 'react-router-dom'


ReactDOM.render(<BrowserRouter><Index /></BrowserRouter>, document.querySelector('#root'));
