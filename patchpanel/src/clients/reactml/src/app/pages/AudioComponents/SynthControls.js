import React from "react";
import {VolumeSlider} from "./VolumeSlider";
import {ADSR} from "./ADSR";
    
export class SynthControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteChecked: this.props.noteChecked,
            waveform: props.waveform,
            cutoff: props.cutoff
        }
        this.handleWaveChange = this.handleWaveChange.bind(this);
    }
    
    handleWaveChange(changeEvent){
        // pass through onChange event to handleWaveChange and set state
        this.props.handleWaveChange(changeEvent);
        this.setState({
            waveform:changeEvent.target.value
        });
    }

    render() {
    var controlsContainerStyle  = {
        padding: 10, 
        marginTop: 10, 
        display: "inline-block",
        float: "left",
        backgroundColor: "#cccccc",
        borderRadius: "1%",
        width: 200,
        height: 500,
    };
    var sliderStyle = {
        display: "inline-block",
        float:"left",
    }

    return (        
        <div className="controls-container" style = {controlsContainerStyle}> 
            Synth Controls
            <div>
            <input 
                type="checkbox"
                name="note on"
                checked={this.state.noteChecked}
                onClick={this.props.handleNoteOn}
            /> Note On
            
            <form action="#" id="wave-form">
            <div className="wave-radio">
                <label><input type="radio"                          
                        value="sine" 
                        checked = {this.state.waveform === 'sine'}
                        onChange={this.handleWaveChange}/> Sine </label> <br/>
            </div>
            <div className="wave-radio">
                <label><input type="radio"                         
                        value="triangle" 
                        checked = {this.state.waveform === 'triangle'}
                        onChange={this.handleWaveChange}/> Triangle </label> <br/>
            </div>
            <div className="wave-radio">
                <label><input type="radio"                         
                        value="square" 
                        checked = {this.state.waveform === 'square'}
                        onChange={this.handleWaveChange} /> Square </label> <br/>
            </div>
            <div className="wave-radio">
                <label><input type="radio"                         
                        value="sawtooth" 
                        checked = {this.state.waveform === 'sawtooth'}
                        onChange={this.handleWaveChange} /> Sawtooth </label> <br/>
            </div>
            </form>
            </div>
            <div className="control-sliders" style={sliderStyle}>
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue="0.5"
                    onChange={this.props.handleVolumeChange}/> Volume
            <input type="range" 
                    min="100" max="5000" step=".5"
                    defaultValue="1000"
                    onChange={this.props.handleFilterChange}/> Low Pass Filter Cutoff
            <input type="range" 
                    min="0.1" max="20" step="0.1"
                    defaultValue="1"
                    onChange={this.props.handleQChange}/> Filter Q
            <hr/>
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue={this.props.attack}
                    onChange={this.props.handleAttackChange}/> Attack
            
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue="0.5"
                    onChange={this.props.handleDecayChange}/> Decay
            <input type="range" 
                    min="0" max="1" step="0.01"
                    defaultValue="0.5"
                    onChange={this.props.handleSustainChange}/> Sustain
            <input type="range" 
                    min="0" max="5" step="0.01"
                    defaultValue="0.5"
                    onChange={this.props.handleReleaseChange}/> Release
            </div> 
        </div>
    );
    }
}

/* 
        <VolumeSlider
                min={0} max={1} step={0.01} defaultValue={0.5}
                handleVolumeChange={this.props.handleVolumeChange}
                /> Volume </div>
                <div>
            <ADSR 
                attackDefault={this.props.attack} decayDefault={this.props.decay}
                sustainDefault={this.props.sustain} releaseDefault={this.props.release}
                handleAttackChange={this.props.handleAttackChange}
                handleDecayChange={this.props.handleDelayChange}
                handleSustainChange={this.props.handleSustainChange}
                handleReleaseChange={this.props.handleReleaseChange}
            />
*/