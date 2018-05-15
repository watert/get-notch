import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import getNotch, { listenNotchChange } from './lib/get-notch';
import './lib/helpers.css';

console.log('getNotch', getNotch())

class App extends Component {
  state = {}
  componentDidMount() {
    // const notch = getNotch().toString();
    // this.setState({ notch });
    // const dom = this.dom = getDom();
    
    this.stopListen = listenNotchChange((notch) => {
      const { count = 0 } = this.state;
      this.setState({ notch, count: count + 1 });
    });
  }
  componentWillUnmount() {
    this.stopListen();
    // this.clearInterval();
  }
  render() {
    const { notch = {} } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="padding-safe-horizontal padding-safe-bottom">
          <div className="App-body">
            <p className="App-intro">See notch value in bottom toolbar.</p>
            <div className="expand"></div>
          </div>
        </div>
        <div className="toolbar-wrap padding-safe-bottom">
          <div className="toolbar">{JSON.stringify(notch)}</div>
        </div>
      </div>
    );
  }
}

export default App;
