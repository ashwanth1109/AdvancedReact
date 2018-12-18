import React from 'react';
import ReactDOMServer from 'react-dom/server'; // This lets you render a React application into a string

import axios from 'axios'; // we use axios for server side as well
import App from '../components/App';

const serverRender = () => {
  return ReactDOMServer.renderToString(<App articles={{}} authors={{}} />);
};

export default serverRender;
