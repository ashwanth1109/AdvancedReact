import React, { Component } from 'react';

export default class App extends Component {
  //===========================================
  // STAGE 2 CLASS PROPERTIES TEST
  //===========================================
  state = {
    test: 'Class Properties Work'
  };
  //===========================================
  // TESTING ASYNC FUNCTIONALITY
  //===========================================
  asyncFunc = () => {
    return Promise.resolve('Promises work');
  };

  async componentDidMount() {
    this.setState({
      test: await this.asyncFunc()
    });
  }

  render() {
    return <h1>HELLO REACT! {this.state.test}</h1>;
  }
}
