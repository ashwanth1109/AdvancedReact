import React, { Component } from 'react';

import ArticleList from './ArticleList';

import DataApi from '../DataApi';
import { data } from '../testData';

const api = new DataApi(data);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: api.getArticles(),
      authors: api.getAuthors()
    };
  }

  render() {
    const { articles, authors } = this.state;
    return <ArticleList articles={articles} authors={authors} />;
  }
}

export default App;

//===========================================
// PART OF INITIAL TEST CODE
//===========================================
// export default class App extends Component {
//   //===========================================
//   // STAGE 2 CLASS PROPERTIES TEST
//   //===========================================
//   state = {
//     test: 'Class Properties Work'
//   };
//   //===========================================
//   // TESTING ASYNC FUNCTIONALITY
//   //===========================================
//   asyncFunc = () => {
//     console.log('object');
//     return Promise.resolve('Promises work');
//   };

//   async componentDidMount() {
//     this.setState({
//       test: await this.asyncFunc()
//     });
//   }

//   render() {
//     return <h1>HELLO REACT! {this.state.test}</h1>;
//   }
// }
