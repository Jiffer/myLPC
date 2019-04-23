import * as React from 'react';

import {DropDown} from './components/Dropdown.tsx';

import {getDataConnection} from '../client.ts';


let colors = {
    0: 'blue',
    1: 'red',
    2: 'green',
    3: 'purple',
    4: 'powderblue',
    5: 'coral',
    6: 'brown',
    7: 'grey',
    8: 'cadetblue',
    9: 'yellow'
};

export default class ColorPage extends React.Component {
    constructor(props) {
        super();
        console.log(props);

        this.state = {
            color: null
        }

    }

    inputConnection;

    handleSelection(selection, type) {
        this.handleInputConnection(selection);
    }

    handleDataReceived(key, value) {
        console.log('receiving key ' + key + ', and value ' + value);
        if (key == 'ml classification') {
            this.setState({
                color: colors[value],
            }, () => {
            console.log('this.state.color is ' + this.state.color)
            //console.log('color[value] is ' + colors[value])
            });
        }
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

        this.props.relayValue('color', 'input', selection);

        this.inputConnection.onDataReceived( (key, value) => {
            //let d = new Date()
            //console.log('Data was received with key: ' + key + ' and value: ' + value + ' at time ' + d.getMilliseconds());
            this.handleDataReceived(key, value);
        });

        //console.log(inputConnecthi;
    }

    render() {
        return(
            <div style={{display: this.props.visibilityState}}>
                <div style={{backgroundColor: this.state.color}}>
                    <button 
                        onClick={ () => this.props.changeView('boxLayout', false) }
                    >
                        Minimize
                    </button>
                    <DropDown 
                        dropDownType={'input connection type'}
                        handleSelection={this.handleSelection.bind(this)}
                    />
                </div>
            </div>
        );
    }
}