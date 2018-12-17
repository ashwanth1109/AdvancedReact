import React, { Component } from 'react';

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
    const { articles } = this.state;
    console.log(articles);
    return <div>...</div>;
  }
}

export default App;

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
