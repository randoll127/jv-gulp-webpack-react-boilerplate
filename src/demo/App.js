import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 100000000);
      var {str,...spread}=props;
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
        <h1 style={{ color: this.props.color }}>
          Counter ({this.props.increment}): {this.state.counter}
        </h1>
    );
  }
}

export class App extends Component {
  render() {
    return (
        <div style={{"padding":"10px"}}>
          <Counter increment={101} color={NICE} />
          <Counter increment={3} color={SUPER_NICE} />
        </div>
    );
  }
}