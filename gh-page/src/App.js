import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import getNotch, { getDomPaddings, getDom, supportsEnvNotch, supportsConstantNotch } from './lib/get-notch';

console.log('getNotch', getNotch())

class App extends Component {
  state = {}
  componentDidMount() {
    // const notch = getNotch().toString();
    // this.setState({ notch });
    const dom = this.dom = getDom();
    this.calculate();
    const interval = setInterval(() => this.calculate(), 1000);
    this.clearInterval = () => clearInterval(interval);
  }
  componentWillUnmount() {
    this.clearInterval();
  }
  calculate() {
    const { count = 0 } = this.state;
    this.setState({
      count: count + 1,
      paddings: getDomPaddings(this.dom),
      // paddingBottom: parseInt(window.getComputedStyle(this.dom).paddingBottom),
      notch: getNotch(),
      supportsEnvNotch: supportsEnvNotch(),
      supportsConstantNotch: supportsConstantNotch(),
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="expand"></div>
        <pre>State: {JSON.stringify(this.state, null, 2)}</pre>
        <div className="toolbar-wrap">
          <div className="toolbar">TOOLBAR</div>
        </div>
      </div>
    );
  }
}

export default App;
