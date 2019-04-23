import React from "react";
import Slider from 'react-rangeslider'
// To include the default styles
import 'react-rangeslider/lib/index.css'

export class VolumeSlider extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      volume: props.defaultValue
    }
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
    this.props.handleVolumeChange(value);
  }

  render() {
    let { volume } = this.state
    return (
      <Slider
        value={volume}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        defaultValue={this.props.defaultValue}
        orientation="vertical"
        onChange={this.handleOnChange}
      />
    )
  }
}

