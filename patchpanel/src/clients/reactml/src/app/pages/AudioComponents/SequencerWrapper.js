// SequencerWrapper
// react based sequencer component
import React from "react";
import {Grid} from "./Grid";
import {SeqControls} from "./SeqControls";
import {getDataConnection} from '../../client';
import {SequencerData} from '../../dataTypes/sequencerData';

// connection objects:
// inputConnection listens for the key "pulse" to advance steps
// I think it should alternatively listen for a "step number"  
// so multiple sequencers are guarunteed to stay syncronized - 
// currently the sequencer keeps its own count
let inputConnection; 

// presetConnection listens for key "ml classification" and a number
// the "ml classification" is the  output from Byron's ML component
let presetConnection;

// outputConnection sends the key "seqData" with a SequencerData object
// this is only using index currently. May also want to contain a value array/object
// to pass such as a velocity or other parameter to sequence
let outputConnection;

export default class SequencerWrapper extends React.Component {
    constructor(props){
        super(props);
        var offset;
        if(props.offset){
            offset = props.offset
        }
        else{
            offset = 60
        }
        
        var gridState = Array(this.props.numSteps * this.props.numChannels).fill(false);
        var stepGridState = Array(this.props.numSteps).fill(false);
        // preset grid is 4x4 
        var presetState = Array(4 * 4).fill(false);
        var presetSaved= Array(4 * 4).fill(false);
        var presets = Array(4*4).fill(gridState);
        var channelsOn = Array(this.props.numChannels).fill(false); // what has been turned on?
        var currentPreset = 0;

        this.state = {
            selectedScale: "scale02",
            scaleSteps: [0,2,4,5,7,9,11], // defaults to chromatic scale
            offset: offset, // what note / channel to start at
            numSteps: this.props.numSteps,
            currentStep: 0,
            numChannels: this.props.numChannels, // how many notes / channels
            gridState: gridState,
            emptyGrid: gridState,
            // presetState keeps track of currently selected preset
            presetState: presetState,
            // presetSaved keeps track of whether a preset has been stored in a given location
            presetSaved: presetSaved,
            // presets stores the presets!
            presets: presets, // will hold an array of the entire grid in different states
            currentPreset: currentPreset, // which one is currently active
            stepGridState: stepGridState,
            channelsOn: channelsOn,
            inputConnectionFormValue: '', // need to be able to clear form on submit
            inputConnectionName: '', // keep track of connection name
            presetConnectionFormValue: '',
            presetConnectionName: '',
            outputConnectionFormValue: '',
            outputConnectionName: '',
            alwaysSendNoteOn: false
        }

        // component functions use object's "this"!
        this.handleScaleChange = this.handleScaleChange.bind(this);
        this.handleClickInputSubmit = this.handleClickInputSubmit.bind(this)
        this.handleInputConnectionChange = this.handleInputConnectionChange.bind(this)
        this.handleClickPresetSubmit = this.handleClickPresetSubmit.bind(this)
        this.handlePresetConnectionChange = this.handlePresetConnectionChange.bind(this)
        this.handleClickOutputSubmit = this.handleClickOutputSubmit.bind(this)
        this.handleOutputConnectionChange = this.handleOutputConnectionChange.bind(this)
        this.handlePresetChange = this.handlePresetChange.bind(this)
        this.handleGridClick = this.handleGridClick.bind(this)
        this.handlePresetClick = this.handlePresetClick.bind(this)
        this.handleScramble = this.handleScramble.bind(this)
        this.handleClear= this.handleClear.bind(this)
        this.playStep = this.playStep.bind(this)
        this.handleSustainNote = this.handleSustainNote.bind(this)
    }
    
    // handle change to scale radio buttons
    // update the radio button state
    // update grid view
    handleScaleChange(changeEvent){
        // since scale was moved to synth // this should be redone
        var majorScale = [0,2,4,5,7,9,11];
        var chromaticScale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        
        const newScale = changeEvent.target.value;
        var scaleSteps = []
        if(newScale === 'scale01'){
            scaleSteps = chromaticScale;
        }else if(newScale === 'scale02'){
            scaleSteps = majorScale;
        }

        this.setState({
            selectedScale:newScale,
            scaleSteps: scaleSteps
        });
        
    }
    // save inputconnection name
    // TODO: make disconnect
    handleClickInputSubmit(event){
        event.preventDefault();        
        console.log("setting input connection to: " + this.state.inputConnectionFormValue);
        if(this.inputConnection){
            this.inputConnection.p2pConnection.disconnect();
        }
        this.inputConnection  = getDataConnection(this.state.inputConnectionFormValue);
        this.inputConnection.onDataReceived((key, value)=>{
            if(key == "pulse"){
                // when a pulse comes in if active, 
                // send out current step and increment
                this.playStep()
            }else if(key =="runStop"){
                let currentStep = this.state.currentStep;
                let stepGridState = this.state.stepGridState;
                let lastStep = currentStep - 1;
                var channelsOn = this.state.channelsOn.slice();

                if(lastStep < 0){ lastStep = this.state.numSteps - 1; }
                if(!value){ // reset to 0 when turning off
                    stepGridState[lastStep] = false;
                    currentStep = 0;

                    var changedSeqDataArray = []; // just channels that have a new state than the previous step
            
                    for (var i = 0; i < this.state.numChannels; i++){
                        channelsOn[i] = false;
                        // set all to false
                        let seqData = new SequencerData(i, false);
                        changedSeqDataArray.push(seqData)
                        // send data out if an changes!
                        if(changedSeqDataArray.length > 0){
                            if(this.outputConnection != null){
                                this.outputConnection.send("seqData", changedSeqDataArray);
                            }
                        }
                    }

                }
                this.setState({
                    channelsOn: channelsOn,
                    stepGridState: stepGridState,
                    currentStep: currentStep,
                })
            }
        })
        this.setState({
            inputConnectionFormValue: '', // clear after submit
            inputConnectionName:this.state.inputConnectionFormValue,  // save connection name
        })
    }
    
    // update the value displayed in the form as user types:
    handleInputConnectionChange(event){
        this.setState({
            inputConnectionFormValue: event.target.value
        })
    }

    // when enter or submit button occurs 
    // set the dataConnection name 
    // TODO: make disconnect when another connection is made
    handleClickPresetSubmit(event){
        event.preventDefault();        
        console.log("setting preset connection to: " + this.state.presetConnectionFormValue);
        if(this.presetConnection){
            this.presetConnection.p2pConnection.disconnect();
        }
        this.presetConnection  = getDataConnection(this.state.presetConnectionFormValue);
        this.presetConnection.onDataReceived((key, value)=>{
            if(key == "ml classification"){
                if (parseInt(value) != this.state.currentPreset){
                    this.handlePresetChange(parseInt(value));
                }    
            }
        })
        this.setState({
            presetConnectionFormValue: '', // clear after submit
            presetConnectionName:this.state.presetConnectionFormValue,  // save connection name
        })
    }
    handlePresetConnectionChange(event){
        this.setState({
            presetConnectionFormValue: event.target.value
        })
    }

    handleClickOutputSubmit(event){
        console.log("setting output to: " + this.state.outputConnectionFormValue);
        if(this.outputConnection){
            this.outputConnection.p2pConnection.disconnect();
        }
        this.outputConnection  = getDataConnection(this.state.outputConnectionFormValue);
        this.setState({
            outputConnectionFormValue: '',
            outputConnectionName:this.state.outputConnectionFormValue
        })
        event.preventDefault();
    }
    handleOutputConnectionChange(event){
        this.setState({
            outputConnectionFormValue: event.target.value
        })
    }

    handleGridClick(e, i){ // beat, note
        // update box state
        var gridState = this.state.gridState.slice();
        // update box state

        gridState[i]= !gridState[i] // toggle state
        this.setState({
            gridState: gridState
        }); 
    }

    handlePresetClick(e, i){
        // update box state
        var presetState = this.state.presetState.slice();
        var presetSaved = this.state.presetSaved.slice();
        var presets = this.state.presets.slice();
        var gridState = this.state.gridState;
        var currentPreset = this.state.currentPreset;
        
        // check modifier
        if(e.shiftKey){
            console.log("save preset " + i);
            presetSaved[i] = true;
            presets[i] = this.state.gridState;
        }else{
            if(presetSaved[i]){
                currentPreset = i;
                for(let j = 0; j < presetState.length; j++){
                    presetState[j] = false;
                }
                presetState[i] = true; 
                gridState = this.state.presets[i];
            }
        }
        this.setState({
            presetSaved: presetSaved,
            presetState: presetState,
            presets: presets,
            currentPreset: currentPreset,
            gridState: gridState
        });
    }

    handlePresetChange(i){
        var presetState = this.state.presetState.slice();
        var presetSaved = this.state.presetSaved.slice();
        var presets = this.state.presets.slice();
        var gridState = this.state.gridState;
        var currentPreset = this.state.currentPreset;

        console.log(" i type " + typeof(i) + " cP " + typeof(currentPreset));
        if(currentPreset != i && presetSaved[i]){
            
            currentPreset = i;
            for(let j = 0; j < presetState.length; j++){
                presetState[j] = false;
            }
            presetState[i] = true; 
            gridState = this.state.presets[i];
        }
        this.setState({
            presetSaved: presetSaved,
            presetState: presetState,
            presets: presets,
            currentPreset: currentPreset,
            gridState: gridState
        })
    }
    handleScramble(e){ 
        console.log("scramble!")
        let gridState = this.state.emptyGrid.slice();

        // start by clearing everything:
        for(let i = 0; i < this.state.numChannels*this.state.numChannels; i++){
            gridState[i] = false;
        }

        // keep track of last note played:
        var lastNote = parseInt(this.state.numChannels * Math.random());
        // then load up to 1 note per step
        for(let i = 0; i < this.state.numSteps; i++){
            if(100 * Math.random() < 50){ // 25% of the time
                
                var randomNote = lastNote + (parseInt(4 * Math.random())-2)
                gridState[(i + randomNote*this.state.numSteps)] = true;
                lastNote = randomNote;
            }
        }

        this.setState({
            gridState: gridState
        })
    }
    handleClear(e){ 
        console.log("clear!")
        
        this.setState({
            gridState: this.state.emptyGrid
        })
    }

    handleSustainNote(e){
        
        this.setState({
            alwaysSendNoteOn: e.target.checked
        })
    }

    playStep(){
        let currentStep = this.state.currentStep;
        let stepGridState = this.state.stepGridState;
        let lastStep = currentStep - 1;
        if(lastStep < 0){ lastStep = this.state.numSteps - 1; }
        // update step indicator
        stepGridState[lastStep] = false;  
        stepGridState[currentStep] = true;            

        var gridState = this.state.gridState.slice();
        var channelsOn = this.state.channelsOn.slice();
        var changedSeqDataArray = []; // just channels that have a new state than the previous step

        for(var i = 0; i < this.state.numChannels; i++){
            let gridIndex = ((i * this.state.numSteps) + this.state.currentStep);
            
            
            if (channelsOn[i] != this.state.gridState[gridIndex]){
                // udpate state
                channelsOn[i] = this.state.gridState[gridIndex];
                let seqData = new SequencerData(i, this.state.gridState[gridIndex]);
                changedSeqDataArray.push(seqData)
            }
            else if((!this.state.alwaysSendNoteOn && this.state.gridState[gridIndex])){
                channelsOn[i] = this.state.gridState[gridIndex];
                let seqData = new SequencerData(i, this.state.gridState[gridIndex]);
                changedSeqDataArray.push(seqData)
            }

        }
        // send data out if an changes!
        if(changedSeqDataArray.length > 0){
            if(this.outputConnection != null){
                this.outputConnection.send("seqData", changedSeqDataArray);
            }
        }
        currentStep++;             
        currentStep %= this.state.numSteps; // roll over to 0

        this.setState({
            currentStep:currentStep,
            stepGridState: stepGridState,
            channelsOn
        })
    }

  render() {
    var seqStyle = {
        width: this.state.numSteps * 27 + 300,
        height: this.state.numChannels * 17 + 300,
        display: "inline-block",
        backgroundColor: "#aaaaaa",
        borderRadius: "1%",
        webkitFilter: "drop-shadow(0px 0px 5px #666)",
        filter: "drop-shadow(0px 0px 5px #666)"
    };

    return (
        <div className="controldiv" style = {seqStyle}>
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
                listening for step on: {this.state.inputConnectionName}
            </form>
            
            <form 
                onSubmit={this.handleClickPresetSubmit}
                >
                <label>
                    <input 
                        type="text" 
                        value={this.state.presetConnectionFormValue}
                        onChange={this.handlePresetConnectionChange}
                    />
                </label>
                <input type="submit" value="Submit" />
                preset on: {this.state.presetConnectionName}
            </form>
            

            <form onSubmit={this.handleClickOutputSubmit}>
                <label>
                    <input 
                        type="text" 
                        value={this.state.outputConnectionFormValue}
                        onChange={this.handleOutputConnectionChange}
                    />
                </label>
                <input type="submit" value="Submit" />
                sending to: {this.state.outputConnectionName}
            </form>
            

            <SeqControls 
                handleScaleChange={(e)=>this.handleScaleChange(e)}
                selectedScale = {this.state.selectedScale}
                handlePresetClick = {this.handlePresetClick}
                presetState = {this.state.presetState}
                presetSaved = {this.state.presetSaved}
                handleScramble = {this.handleScramble}
                handleClear = {this.handleClear}
                handleSustainNote = {this.handleSustainNote}
            />
            <br/>
            <div>
            Current Step: {this.state.currentStep + 1}
            <Grid 
                channels={this.state.numChannels}
                numSteps={this.state.numSteps}
                isPiano={true}
                scale={this.state.scaleSteps}
                gridState={this.state.gridState}
                handleGridClick={this.handleGridClick}
            />

            <Grid
                channels={1}
                numSteps={this.state.numSteps}
                gridState= {this.state.stepGridState}
            /></div>
        </div>
    );
  }
}

