

import * as React from 'react';

import PreTypedOutput from './PreTypedOutput';

import Toggle from 'react-toggle';
import '../cssFiles/reactToggle.css';

interface Props {
    handleSelection: (selection: string, type?: string) => void,
    toggleSend: (parameter:string) => void,
    parameter: string,
    orientation?: string,
}


export default class RoutableOutput extends React.Component <Props, any>{
    constructor(props) {
        super();
        this.state = {
            checkParameter: props.parameter,
            checkValue: false,
            /*
            checkXAcceleration: false,
            checkYAcceleration: false,
            checkZAcceleration: false,
            checkAccelerationMagnitude: false,
            checkTemperature: false,
            checkBrightness: false,
            checkDirection: false,
            checkAButton: false,
            checkBButton: false,
            switchX: false,
            switchY: false,
            switchZ: false,
            switchS: false,
            switchAButton: false,
            switchBButton: false,
            */
        }
    }


    /* Universal version of handleChange */
    handleChange = ():void => {
        this.setState (
            {
                checkValue: !this.state.checkValue
            }, () => {
                console.log(this.props.parameter + ' set to ' + this.state.checkValue)
                this.props.toggleSend(this.props.parameter.replace(/ /g, ''));
                //this.props.toggleSend(this.props.parameter)
            }
        );
    } 

    /*  Version of handleChange that is just for the microbit (state predefined)
    handleChange = (checkParam:string, switchParam?:string) => {
        if (checkParam in this.state) {  
        // might need to add a check to see if the parameter is supported (can be sent by the device) later
            console.log(checkParam);
            console.log(this.state[checkParam]);
            this.setState({
                [checkParam]: !this.state[checkParam],
            }, () => {
                    console.log(checkParam + ' changed to ', this.state.checkX);
                    //console.log('switchX changed to ', this.state.switchX);
                }
            );
        }
        
        else {
            console.log('parameter does not exist on type MicroBit');
        }
        
    }
    */


    
    render() {
        let interfaceStyle = {
            width: '100%', 
            borderSpacing: 10, 
        }
        let elementStyle={
            display: 'inline-block',
            verticalAlign: 'middle',
            margin: '10px',
        }
        return (
            <div>
                <div style={interfaceStyle}>
                    <div style={elementStyle}>
                        <input 
                            type="checkbox"
                            // nifty way to pass parameters to onChange, onClick, etc. component properties
                            onChange={ () => this.handleChange() } //'check' + this.props.parameter.replace(/ /g,'')) }
                            // replace whitespace with no space for dictionary lookup
                            

                        />
                    </div>
                    <h5 style={elementStyle}> {this.props.parameter + ' Value'} </h5>
                    <div style={{display:'inline-block', margin:10, verticalAlign:'bottom'}}>
                        <PreTypedOutput 
                            handleSelection={this.props.handleSelection}
                            orientation={'microbit'}/>
                    </div>

                    <div style={elementStyle}>
                        <Toggle
                            checked={this.state.checkValue}
                            style={elementStyle}
                        />
                    </div>
                </div>
            </div>
        );
    }
    
}