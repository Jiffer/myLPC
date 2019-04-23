
import * as React from 'react';

import Output from './Output';
import RoutableOutput from './RoutableOutput';

import Toggle from 'react-toggle';
import '../cssFiles/reactToggle.css';


interface Props {
    handleSelection: (selection:string, type?:string) => void;
    toggleSend: (parameter:string) => void;
}


export class MbitInterface extends React.Component <Props, any> {
    constructor(props) {
        super();
        this.state = {
            checkX: false,
            checkY: false,
            checkZ: false,
            checkS: false,
            checkAButton: false,
            checkBButton: false,
            switchX: false,
            switchY: false,
            switchZ: false,
            switchS: false,
            switchAButton: false,
            switchBButton: false,
        }
    }
    
    /*
    handleChange = (checkParam:string, switchParam?:string) => {
        console.log(checkParam);
        console.log(this.state[checkParam]);
        this.setState({
            [checkParam]: !this.state[checkParam],
        }, () => {

                console.log(checkParam + ' changed to ', this.state.checkX);
                this.props.toggleSend()
                //console.log('switchX changed to ', this.state.switchX);
            }
        );
    }
    */

    render() {
        let interfaceStyle = {
            width: '100%', /*Optional*/
            borderSpacing: 10, /*Optional*/
        }
        let elementStyle={
            display: 'inline-block',
            verticalAlign: 'top',
            margin: '10px',
            
        }
        //console.log('mbitinterface sees this.props.handleSelection as ', this.props.handleSelection)
        return (
            <div>
                <h3> For this first version, only select 1 output at a time - otherwise infinite alert loop may occur </h3>
                <br/>
                <div style={elementStyle}>
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='X Acceleration'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='Y Acceleration'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='Z Acceleration'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='Acceleration Magnitude'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='All Acceleration'
                    />
                </div>
                <div style={elementStyle}>
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='Temperature'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='Brightness'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='Direction'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='A Button'
                    />
                    <RoutableOutput 
                        handleSelection={this.props.handleSelection}
                        toggleSend={this.props.toggleSend}
                        orientation='microbit'
                        parameter='B Button'
                    />
                </div> 
            </div>
        );
    }

}