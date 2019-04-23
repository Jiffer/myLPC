import React, {Component} from 'react';
import {render} from 'react-dom';
import {DropDown} from './components/Dropdown';
import {MlComponent} from './components/MlComponent.jsx'
import Output from './components/Output';
import {getDataConnection} from '../client.ts';

let lastClassificationOutput = -1;

export default class MlPage extends Component {
    

    constructor(props) {
        super();
        this.state = {
            algorithm: null,
            remoteInput: null,
            inputRoomName: null,
            outputRoomName: null,
            ignoreRoomInput: true,
            //true (default) corresponds to mouse input, false is room input
            //have to do this as we potentially have data coming in from 2 sources
        }
        this.handleDataReceived = this.handleDataReceived.bind(this);
    }


    inputConnection =  null;
    outputConnection = null;

    
    ignoreInput(inputBoolean) {
        this.setState({
            ignoreRoomInput: inputBoolean
        }, () => {
            if (this.state.ignoreRoomInput) {
                console.log('Ignoring data, getting data from mouse');
            }
            else console.log('Ignoring mouse, getting data from ' + this.inputConnection);
            }
        );
    }

    handleDataReceived = (key, value) => {
            //console.log('data received, input boolean is ', this.state.ignoreRoomInput)
        if (!this.state.ignoreRoomInput) {
            this.setState({
                remoteInput: value
            }, () => {
                //console.log('set remote input to value: ', value);
            })
            // may need to add type checking here later for key, data value type

        }
    }

    handleAlgorithm(algorithm) {
        this.setState({
            algorithm: algorithm
        });
        console.log('algorithm changed to ' + algorithm);

        this.props.relayValue('ml', 'algorithm', algorithm)
    }

    handleInputConnection(selection) {
        if (this.inputConnection) {
            this.inputConnection.p2pConnection.disconnect();
            console.log('disconnected from: ' + this.state.inputRoomName);
        }
        this.setState({
            inputRoomName: selection,
        });
        
        this.inputConnection = getDataConnection(selection);  //handle here
        console.log('A new input connection of name: ' + selection + ' was made');

        this.props.relayValue('ml', 'input', selection);

        this.inputConnection.onDataReceived( (key, value) => {
            //let d = new Date()
            //console.log('Data was received with key: ' + key + ' and value: ' + value + ' at time ' + d.getMilliseconds());
            this.handleDataReceived(key, value);
        });

        //console.log(inputConnection);
    }

    handleSelection(selection, type) {
        console.log('a room of selection: ' + selection + ', and type: ' + type + ' was made!');
        if (type == 'ml') {
            this.handleAlgorithm(selection);
        } 
        else if (type == 'input connection type') {
            this.handleInputConnection(selection);
        }
        else if (type == 'output connection type') {
            this.handleOutputConnection(selection);
        }
    }

    handleOutputConnection(selection) {
        if (this.outputConnection) {
            //if user is already outputing to a room (outputConnection already exists)
            this.outputConnection.p2pConnection.disconnect();
            console.log('disconnected from' + this.state.outputRoomName)
        }
        if (selection) {
            this.setState({
                outputRoomName: selection,
            });

            this.outputConnection = getDataConnection(selection);
            console.log('A new output connection of name: ' + selection + ' was made');

            this.props.relayValue('ml', 'output', selection)
        }

    }

    handleClassification(classificationOutput) {
        if (this.outputConnection) 
        {
            if(parseFloat(classificationOutput) != parseFloat(lastClassificationOutput)){
                this.outputConnection.send('ml classification', classificationOutput);
            }
            lastClassificationOutput = classificationOutput;
        }
    }


    render() {
        let tempMoveLeft = {
            position: 'relative',
            display: 'inline-block',
            //right:'10%',
            
            /*
            position: 'static',
            left: 20,
            top: 20,
            zIndex: 1
            */
        }
        return (
            <div style={{display:this.props.visibilityState}}>
                <button 
                    style={{float:'right'}} 
                    onClick={ () => this.props.changeView('boxLayout', false) }
                >
                    Minimize
                </button>
                <div className="container" style={{width: '100%', display:'flex'}}>
                    <div style={tempMoveLeft}>
                        <h1> Webinator Machine Learning </h1>
                        
                        {/** This first dropdown is part of the regular inputs selections */}
                        <DropDown 
                            dropDownType={'input connection type'}
                            handleSelection={this.handleSelection.bind(this)}
                        />
                        <DropDown
                            dropDownType={'output connection type'}
                            handleSelection={this.handleSelection.bind(this)}
                        />
                        { /** see if changing handleSelection to handleInputsSelection Caused an error */}
                        <DropDown 
                            dropDownType={'ml'} 
                            handleSelection={this.handleSelection.bind(this)}
                        />
                    </div>
                        <MlComponent 
                            algorithm={this.state.algorithm}
                            remoteInput={this.state.remoteInput}
                            ignoreRoomInput={this.state.ignoreRoomInput}
                            ignoreInput={this.ignoreInput.bind(this)}
                            outputConnection={this.outputConnection}
                            outputRoomName={this.outputRoomName}
                            handleClassification={this.handleClassification.bind(this)}
                        />
                </div>
            </div>
        );
    }
}
    
