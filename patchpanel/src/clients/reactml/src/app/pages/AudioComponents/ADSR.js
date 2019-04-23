import React from "react";
import Slider from 'react-rangeslider'
// To include the default styles
import 'react-rangeslider/lib/index.css'

export class ADSR extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
        attack: props.attackDefault,
        decay: props.decayDefault,
        sustain: props.sustainDefault,
        release: props.releaseDefault
    }
  }

  handleAttackChange = (value) => {
    this.setState({
      attack: value
    })
    this.props.handleAttackChange(value);
  }

  handleOnChange = (value) => {
    this.setState({
      volume: value
    })
    // handlewhatever
  }

  render() {
      
    let { attack } = this.state.attack
    let { decay } = this.state.decay
    let { sustain } = this.state.sustain
    let { release } = this.state.release
    return (
        <div>
            
            <Slider
                value={attack}
                min={0}
                max={2}
                step={0.01}
                defaultValue={this.props.attackDefault}
                orientation="vertical"
                onChange={this.handleAttackChange}
            />
            
            <Slider
            value={decay}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            defaultValue={this.props.defaultValue}
            orientation="vertical"
            onChange={this.handleOnChange}
            />
            
    </div>
    )
  }
}

