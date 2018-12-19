import React from 'react';
import ReactDOMServer from 'react-dom/server'; // This lets you render a React application into a string

import DataApi from 'state-api';
import axios from 'axios'; // we use axios for server side as well

import App from '../components/App';
import { port, host } from 'config';

const serverRender = async () => {
  const res = await axios.get(`http://${host}:${port}/data`);
  const api = new DataApi(res.data);

  return ReactDOMServer.renderToString(
    <App articles={api.getArticles()} authors={api.getAuthors()} />
  );
};

export default serverRender;
