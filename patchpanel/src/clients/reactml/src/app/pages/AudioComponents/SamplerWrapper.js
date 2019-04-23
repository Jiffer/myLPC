import React from "react";
import {getDataConnection} from '../../client';
import {SampleControls} from "./SampleControls";
import {Sampler} from './Sampler.ts'

// globals
var audioCtx = new (window.AudioContext);
// let sampler = new Sampler(audioCtx); // 
let samplerArray = [];
let numSamplers = 4;
for( var i = 0; i < numSamplers; i++){
    var newSampler = new Sampler(audioCtx);
    samplerArray.push(newSampler);
}

// import kick from  "./samples/kick.wav"
var sampleURLs = []
sampleURLs[0] = require("./samples/hihat.wav");
sampleURLs[1] = require("./samples/cowbell.wav");
sampleURLs[2] = require("./samples/snare.wav");
sampleURLs[3] = require("./samples/kick.wav");

// sampler.loadSample(kickUrl);
for( var i = 0; i < numSamplers; i++){  
    samplerArray[i].loadSample(sampleURLs[i]);
}

let inputConnection;

export default class SamplerWrapper extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            numSamplers: 4, // how many simultaneous samples
            inputConnectionFormValue: '',
            inputConnectionName: '',
        }
        this.handleClickInputSubmit = this.handleClickInputSubmit.bind(this)
        this.handleInputConnectionChange = this.handleInputConnectionChange.bind(this)
        this.handleSamplePlayClick = this.handleSamplePlayClick.bind(this);        
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleStartPercentage = this.handleStartPercentage.bind(this);
        this.handleStopPercentage = this.handleStopPercentage.bind(this);
    }

    handleClickInputSubmit(event){
        event.preventDefault();        
        console.log("setting input connection to: " + this.state.inputConnectionFormValue);
        if(this.inputConnection){
            this.inputConnection.p2pConnection.disconnect();
        }
        this.inputConnection = getDataConnection(this.state.inputConnectionFormValue);
        this.inputConnection.onDataReceived((key, value)=>{
            if (key == "seqData"){ 
                for(var i = 0; i < value.length; i ++){
                    if(value[i].data.state){
                        samplerArray[value[i].data.index].noteOn();
                    }
                }
            }
        })
        this.setState({
            inputConnectionFormValue: '', // clear after submit
            inputConnectionName:this.state.inputConnectionFormValue,  // save connection name
        })
    }
    // handle change to scale radio buttons
    // update the radio button state
    // update grid view
    
    
    handleInputConnectionChange(event){
        this.setState({
            inputConnectionFormValue: event.target.value
        })
    }
    
    
    handleNoteOn(e){
        // console.log(e.target.checked)
        
    }

    handleSamplePlayClick(e, i){
        samplerArray[i].noteOn();
    }

    handleVolumeChange(e, i){
        // console.log("got " + e.target.value);
        samplerArray[i].setVolume(parseFloat(e.target.value)); // with react-range-slider library this would just be e
    }

    handleStartPercentage(e, i){
        samplerArray[i].setStartPercentage(e.target.value);
    }
    handleStopPercentage(e, i){
        samplerArray[i].setStopPercentage(e.target.value);
    }
    handleSampleRate(e, i){
        samplerArray[i].setRate(e.target.value);
    }


    renderSampler(i) {
        var newSamp = 
            <SampleControls
                key = {i}
                index = {i}
                name = {" Play Sample"}
                handleSamplePlayClick={(e, index)=>this.handleSamplePlayClick(e, index)}
                handleVolumeChange={(e, index)=>this.handleVolumeChange(e, index)}
                handleStartPercentage={(e, index)=>this.handleStartPercentage(e, index)}
                handleStopPercentage={(e, index)=>this.handleStopPercentage(e, index)}
                handleSampleRate={(e, index)=>this.handleSampleRate(e, index)}
            />
        return(newSamp)
      }

  render() {
    var sampStyle = {
        width: 400,
        height: 750,
        float:"left",
        display: "inline-block",
        backgroundColor: "#bbbbbb",
        borderRadius: "1%",
        webkitFilter: "drop-shadow(0px 0px 5px #666)",
        filter: "drop-shadow(0px 0px 5px #666)"
    };

    var samplerRenders = [];
    {
        for (var i = 0; i < this.state.numSamplers; i++){
            samplerRenders.push(this.renderSampler(i));
        }   
    }

    return (
        <div className="controldiv" style = {sampStyle}>
            <div>
            <form 
                onSubmit={this.handleClickInputSubmit}
                >
                <label>
                    <input 
                        type="text" 
                        value={this.state.inputConnectionFormValue}
                        onChange={this.handleInputConnectionChange}
                    />
                </label>
                <input type="submit" value="Submit" />
                listening on: {this.state.inputConnectionName}
            </form>
            
            </div>
            <div>
            {samplerRenders}
            </div>
            
        </div>
    );
  }
}

