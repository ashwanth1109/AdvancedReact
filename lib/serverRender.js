import React from 'react';
import ReactDOMServer from 'react-dom/server'; // This lets you render a React application into a string

import App from './components/App';

const serverRender = () => {
  return ReactDOMServer.renderToString(<App />);
};

export default serverRender;
