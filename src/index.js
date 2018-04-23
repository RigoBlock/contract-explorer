import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import ReactGA from 'react-ga';

ReactGA.initialize('UA-117973096-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

registerServiceWorker();
