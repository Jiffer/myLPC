import React from "react";
import {SynthControls} from "./SynthControls";
import {Grid} from "./Grid";
import {getDataConnection} from '../../client';
import {SubtractiveSynth} from './SubtractiveSynth.ts'
import {SequencerData} from '../../dataTypes/sequencerData';


// globals
var audioCtx = new (window.AudioContext);
let polySynth = new SubtractiveSynth(audioCtx, 13, 3); // 13 notes starting in octave 3 (middle C)
polySynth.setVolume(0.5);

let inputConnection;
let filterCutoffConnection;


export default class SynthWrapper extends React.Component {
    
    constructor(props){
        super(props);
        var pianoState = Array(13).fill(false); // 13 notes to start

        this.state = {
            waveform: "sine",
            pianoState: pianoState,
            polyphony: 13, // how many simultaneous notes?
            octave: 3,
            scaleSteps: [0,1,2,3,4,5,6,7,8,9,10,11],
            offset: 0, // middle C
            selectedScale: "scale01",
            inputConnectionFormValue: '',
            inputConnectionName: '',
            filterCutoffConnectionFormValue: '',
            filterCutoffConnectionName: '',
            cutoff: 1000
        }
        this.handleClickInputSubmit = this.handleClickInputSubmit.bind(this)
        this.handleInputConnectionChange = this.handleInputConnectionChange.bind(this)
        this.handleClickFilterConnectionSubmit = this.handleClickFilterConnectionSubmit.bind(this)
        this.handleFilterCutoffConnectionChange = this.handleFilterCutoffConnectionChange.bind(this)
        this.handleScaleChange = this.handleScaleChange.bind(this);
        this.handleWaveChange = this.handleWaveChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleAttackChange = this.handleAttackChange.bind(this);
        this.handlePianoClick = this.handlePianoClick.bind(this);
        this.updateScale = this.updateScale.bind(this)
        this.handleOctaveUp = this.handleOctaveUp.bind(this);
        this.handleOctaveDown = this.handleOctaveDown.bind(this);
        
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
                    // console.log("i " + i + " data.index " + value[i].data.index + " state " + value[i].data.state );
                    polySynth.noteOn(value[i].data.index, value[i].data.state );
                }
                // polySynth.noteOn(value.data.index, true);
            }
            else if(key == "noteOn"){
                // // console.log("got midi: index: " + value.data.index + " note: " + value.data.note + " vel: " + value.data.velocity);
                // polySynth.setNote(value.data.index, value.data.note);
                // polySynth.noteOn(value.data.index, true);
            }else if(key =="noteOff"){
                // console.log("note off " + value.data.index);
                // polySynth.noteOn(value.data.index, false);
            }
        })
        this.setState({
            inputConnectionFormValue: '', // clear after submit
            inputConnectionName:this.state.inputConnectionFormValue,  // save connection name
        })
    }
    handleInputConnectionChange(event){
        this.setState({
            inputConnectionFormValue: event.target.value
        })
    }
    handleClickFilterConnectionSubmit(event){
        event.preventDefault();   
        if(this.filterCutoffConnection){
            this.filterCutoffConnectionc.p2pConnection.disconnect();
        }     
        console.log("setting filter cutoff connection to: " + this.state.filterCutoffConnectionFormValue);
        this.filterCutoffConnection = getDataConnection(this.state.filterCutoffConnectionFormValue);
        this.filterCutoffConnection.onDataReceived((key, value)=>{
            var cutoff = this.state.cutoff;
            if (key == "ml classification"){ 
                polySynth.setFilterCutoff(parseFloat(value) * 2000 + 200);
            }
            this.setState({
                cutoff: cutoff
            })
        })
        this.setState({
            filterCutoffConnectionFormValue: '', // clear after submit
            filterCutoffConnectionName:this.state.filterCutoffConnectionFormValue,  // save connection name
        })
    }
    handleFilterCutoffConnectionChange(event){
        this.setState({
            filterCutoffConnectionFormValue: event.target.value
        })
    }
    // handle change to scale radio buttons
    // update the radio button state
    // update grid view
    handleScaleChange(changeEvent){
        var majorScale = [0,2,4,5,7,9,11];
        var minorScale = [0,2,3,5,7,9,10];
        var chromaticScale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        
        const newScale = changeEvent.target.value;
        var scaleSteps = []
        if(newScale === 'scale01'){
            scaleSteps = chromaticScale;
        }else if(newScale === 'scale02'){
            scaleSteps = majorScale;
        }else if(newScale === 'scale03'){
            scaleSteps = minorScale;
        }else{
            scaleSteps = chromaticScale;
        }

        this.updateScale(scaleSteps, this.state.octave, this.state.offset);
        this.setState({
            selectedScale:newScale,
        });
    }
    

    updateScale(scaleSteps, octave, offset){
        // update synth voices to selected scale
        for(let i=0; i < this.state.polyphony; i++){   
            let currentVoice = (this.state.polyphony - 1) - i;
            let whatOctave = Math.floor( (currentVoice) / scaleSteps.length);
            
            // scaleSteps is an array representing the scale eg a Major scale: [0, 2, 4, 5, 7, 9, 11]
            // octave is used to move the whole scale up and down an octave
            // offset is used to move the scale up/down a step
            // whatOctave is calculated to determine when the scale should be repeated in the next octave 
            let note = scaleSteps[currentVoice % scaleSteps.length] + offset + ((octave + 2)* 12) + whatOctave * 12;
            polySynth.setNote(i, note);
        }

        this.setState({
            scaleSteps: scaleSteps
        });
    }
    
    handleWaveChange(e){
        const waveform = e.target.value;
        // update synth voices
        polySynth.setWaveform(waveform); // type: OscillatorType = "sine" | "square" | "sawtooth" | "triangle" | "custom";
        
        this.setState({
            waveform:waveform,
        });
    }

    handleNoteOn(e){
        // console.log(e.target.checked)
        polySynth.noteOn(0, e.target.checked); // boolean
    }

    handleVolumeChange(e){
        polySynth.setVolume(parseFloat(e.target.value)); // with react-range-slider library this would just be e
    }

    handleAttackChange(e){
        polySynth.setEnvA(parseFloat(e.target.value));
    }
    handleDecayChange(e){
        polySynth.setEnvD(parseFloat(e.target.value));
    }
    handleSustainChange(e){
        polySynth.setEnvS(parseFloat(e.target.value));
    }
    handleReleaseChange(e){
        polySynth.setEnvR(parseFloat(e.target.value));
    }
    handleFilterChange(e){
        polySynth.setFilterCutoff(parseFloat(e.target.value));
    }
    handleQChange(e){
        polySynth.setFilterQ(parseFloat(e.target.value));
    }

    handlePianoClick(e, i){ 
        // update box state
        var pianoState = this.state.pianoState.slice();
        // update box state
        //var chan = Math.floor(i / this.state.steps);
        var numSteps = i % this.state.numSteps;
        pianoState[i]= !pianoState[i] // toggle state
        polySynth.noteOn(i, pianoState[i]);
            // TODO: set a timer to turn it off
        this.setState({
            pianoState: pianoState
        }); 
    }
    handleOctaveUp(){
        let octave = this.state.octave;
        octave++;
        this.updateScale(this.state.scaleSteps, octave, this.state.offset);
        this.setState({
            octave: octave
        })
    }
    handleOctaveDown(){
        let octave = this.state.octave;
        octave--;
        this.updateScale(this.state.scaleSteps, octave, this.state.offset);
        this.setState({
            octave: octave
        })
    }

  render() {
    var seqStyle = {
        width: 600,
        height: 550,
        float:"left",
        display: "inline-block",
        backgroundColor: "#bbbbbb",
        borderRadius: "1%",
        webkitFilter: "drop-shadow(0px 0px 5px #666)",
        filter: "drop-shadow(0px 0px 5px #666)",
        display: "flex"
    };

    return (
        <div className="controldiv" style = {seqStyle}>
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
                listening for seqData on: {this.state.inputConnectionName}
            </form>
            <form 
                onSubmit={this.handleClickFilterConnectionSubmit}
                >
                <label>
                    <input 
                        type="text" 
                        value={this.state.filterCutoffConnectionFormValue}
                        onChange={this.handleFilterCutoffConnectionChange}
                    />
                </label>
                <input type="submit" value="Submit" />
                listening for cutoff frequency on: {this.state.filterCutoffConnectionName}
            </form>
            Scale:
            <div>
                <form action="#" id="scale-form">
                    <div className="scale-radio">
                        <label><input type="radio" 
                                value="scale01" 
                                checked = {this.state.selectedScale === 'scale01'}
                                onChange={this.handleScaleChange}/> Chromatic</label> <br/>
                    </div>
                    <div className="scale-radio">
                        <label><input type="radio" 
                                
                                value="scale02" 
                                checked = {this.state.selectedScale === 'scale02'}
                                onChange={this.handleScaleChange}/> Major</label> <br/>
                    </div>
                    <div className="scale-radio">
                        <label><input type="radio" 
                                
                                value="scale03" 
                                checked = {this.state.selectedScale === 'scale03'}
                                onChange={this.handleScaleChange} /> Minor</label> <br/>
                    </div>
                </form>
            </div>
            octave: <input type="submit" value="-" onClick={this.handleOctaveDown}/> {this.state.octave} <input type="submit" value="+" onClick={this.handleOctaveUp} />
            <Grid 
                channels={13}
                numSteps={1}
                scale={this.state.scaleSteps}
                gridState={this.state.pianoState}
                handleGridClick={this.handlePianoClick}
            /></div>
            <div>
            <SynthControls
                handleWaveChange={(e)=>this.handleWaveChange(e)}
                handleNoteOn={this.handleNoteOn}
                waveform = {this.state.waveform}
                handleVolumeChange={(e)=>this.handleVolumeChange(e)}
                handleFilterChange={(e)=>this.handleFilterChange(e)}
                handleQChange={(e)=>this.handleQChange(e)}

                handleAttackChange={(e)=>this.handleAttackChange(e)}
                handleDecayChange={(e)=>this.handleDecayChange(e)}
                handleSustainChange={(e)=>this.handleSustainChange(e)}
                handleReleaseChange={(e)=>this.handleReleaseChange(e)}
                cutoff = {this.state.cutoff}
                attack={0.1}
                decay={0.2}
                sustain={0.3}
                release={0.5}

            /></div>
            
        </div>
    );
  }
}

