import React from 'react';
import ReactDOM from 'react-dom';

import App from '../components/App';

const { articles, authors } = window.initialData;

ReactDOM.render(
  <App articles={articles} authors={authors} />,
  document.getElementById('root')
);
