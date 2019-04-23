
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select'
import 'react-select/dist/react-select.css'; 

//var Button = require('react-bootstrap').Button;

//hi

let outputOptions = [
    {value: 0, label: '0'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
    {value: 6, label: '6'},
    {value: 7, label: '7'},
    {value: 8, label: '8'},
    {value: 9, label: '9'},
]

export class TrainInterface extends Component {
    constructor(props) {
        super();
        this.state = {
            output: 0,

        }
        this.updateValue = this.updateValue.bind(this);
        this.updateNumOptions = this.updateNumOptions.bind(this);
        this.booltoIndex = this.booltoIndex.bind(this);
        this.toggleInputColor = this.toggleInputColor.bind(this);
        this.traintext = ['Click to train', 'Trained!'],
        this.recordtext = ['Click to record', 'Recording'],
        this.runtext = ['Click to run', 'Running!'],
        this.cleartext = ['Clear training data', 'Cleared!'],
        this.selectValue = 0,
        this.boundaryState = false,
        this.boundaryText =  ['Click to Show Boundaries', 'Click to Remove Boundaries']
    }


    booltoIndex(booleanState) {
        if (booleanState) {
            return 1;
        }
        else return 0;
    }
    updateValue (newValue) {
	    this.selectValue = newValue;   //automatically gets the label
        this.props.relayOutput(newValue.value);
    }

    updateNumOptions (expectedInputLength) {
        this.props.relayInputLength(expectedInputLength.value);
    }
    
    toggleInputColor(inputBool) {
        if (inputBool) {
            return "success";
        }
        else return "primary";
    }

    render() {
       let trainInterface = {
                width:300, 
                height: 500,
                backgroundColor: 'white',
                borderColor: 'black',
                borderStyle: 'solid',
                margin: 'auto',
                marginLeft: 0,
                marginRight: 10,
                paddingLeft: 5,
        } 
        let outputDropDownStyle = {
            width: '35%',
            marginTop: 0,
            paddingTop: 5,
        }
        let noBotPad = {
            marginBottom: 0,
            paddingBottom: 0,
        }
        let smallTopPad = {
            paddingTop: 5
        }                

        let recordColor = this.props.recordState ? "warning" : "primary"
        let trainColor = this.props.trainState ? "success" : "info"
        let runColor = this.props.runState ? "success" : "info"
        let clearColor = this.props.clearState ? "success" : "info"
        // *** add onchange to value for my input form for ml output classifier
        return (

            <div style={trainInterface}> 
                <h4 style={noBotPad}> Toggle Data Input </h4>
                <div style={{...noBotPad, ...smallTopPad}}>
                    <Button 
                        onClick={this.props.setInput}
                        bsStyle={this.toggleInputColor(!this.props.dataInput)}>
                        Connection as Input
                    </Button>
                    <Button 
                        onClick={this.props.setMouse}
                        bsStyle={this.toggleInputColor(this.props.dataInput)}>
                        Mouse as Input
                    </Button>
                </div>

                <h4 style={{...noBotPad, ...smallTopPad}}> Training Options </h4>
                <div style={{...noBotPad, ...smallTopPad}}>

                    <Button 
                        bsStyle={recordColor} 
                        onClick={this.props.togRecord}> 
                        {this.recordtext[this.booltoIndex(this.props.recordState)]} 
                    </Button>
                    <Button 
                        bsStyle={trainColor}
                        onClick={this.props.trainMe}> 
                        {this.traintext[this.booltoIndex(this.props.trainState)]} 
                    </Button>
                    <Button 
                        bsStyle={runColor}
                        onClick={this.props.togRun}> 
                        {this.runtext[this.booltoIndex(this.props.runState)]} 
                    </Button>
                    <Button 
                        bsStyle={clearColor}
                        onClick={this.props.clearMe}> 
                        {this.cleartext[this.booltoIndex(this.props.clearState)]} 
                    </Button>
                </div>

                <button onClick={this.props.showTrainSet}> 
                    Show Train Set
                </button>
                <button onClick={
                    () => {
                        this.boundaryState = !this.boundaryState
                        this.props.boundaryToggle(this.boundaryState)
                    }
                }
                >
                    {this.boundaryText[this.booltoIndex(this.boundaryState)]}
                </button>
                {/* May Implement a div that shows the data as it's streaming in for the user to see

                */}
                
                <h4 style={noBotPad}> Select Length of Inputs </h4>
                <div style={outputDropDownStyle}>
                    
                    <Select ref="outputBar"
                        autofocus 
                        options={outputOptions}
                        clearable={true}
                        value={this.props.numInputs}
                        name="selected-state" 
                        onChange={this.updateNumOptions}
                        searchable={false}
                    /> 
                </div>

                <h4 style={noBotPad}> Select Training Output </h4>
                <div style={outputDropDownStyle}>

                    <Select ref="outputBar"
                        autofocus 
                        options={outputOptions}
                        clearable={true}
                        value={this.selectValue}
                        name="selected-state" 
                        onChange={this.updateValue}
                        searchable={false}
                    /> 
                </div>

                <h3> Classification Output: {this.props.rapidOutput} </h3>

            </div>
        );
    }
}