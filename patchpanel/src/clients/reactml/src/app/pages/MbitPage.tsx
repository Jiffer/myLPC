
//import React, {Component} from 'react';
import * as React from 'react';
//may need to switch this to import React, {Component} from 'react' if get errors later due to depreciation warning
import {render} from 'react-dom';

import {getDataConnection} from '../client';
import * as mbit from '../dataTypes/myMbitData';
import * as bt from '../bt';

//import {DropDown} from './components/Dropdown';
//import Output from './components/Output';

import {MbitInterface} from './components/MbitInterface';




/*
let aDataTest = new mbit.accelerometerData('jiffermidi');
aDataTest.setX(495)
export let dataName = [aDataTest.name, aDataTest.data]
*/



interface mBitProps {
    aData: mbit.accelerometerData
    tData: mbit.temperatureData
    bData: mbit.brightnessData
    dData: mbit.directionData
    aButton: mbit.aButton
    bButton: mbit.bButton
    outputConnection:any 
    keyAll: string;
    keyX: string;
    keyY: string;
    keyZ: string;
    keyS: string;
    keyTemp: string;
    keyBright: string;
    keyDir: string;
    keyAButton: string;
    keyBButton: string; 
    sendXAcceleration: boolean,
    sendYAcceleration: boolean,
    sendZAcceleration: boolean,
    sendAccelerationMagnitude: boolean,
    sendAllAcceleration: boolean,
    sendTemperature: boolean,
    sendBrightness: boolean,
    sendDirection: boolean,
    sendAButton: boolean,
    sendBButton: boolean
}

interface Props {
  changeView: (component:string, currentState:boolean) => void,
  relayValue: (component:string, type:string, newValue:string) => void,
  visibilityState: string,
}

interface stateTypes {
    outputRoomName: string,
    minimized: boolean,
    visible: string
}

export default class MbitPage extends React.Component < Props, stateTypes>{
    
    constructor(props) {
        super();
        
        this.state = {
            outputRoomName: null,
            minimized: false,
            visible: 'none',
        }
        
        this.connectClicked = this.connectClicked.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.appendToLog = this.appendToLog.bind(this);
        this.startReadingFromUART = this.startReadingFromUART.bind(this);
        this.handleOutputConnection = this.handleOutputConnection.bind(this);

    }
    public mBitProps:mBitProps = {
        aData: new mbit.accelerometerData,
        tData: new mbit.temperatureData,
        bData: new mbit.brightnessData,
        dData: new mbit.directionData,
        aButton: new mbit.aButton,
        bButton: new mbit.bButton,
        outputConnection: null,
        keyAll: 'all',
        keyX: 'x',
        keyY: 'y',
        keyZ: 'z',
        keyS: 's',
        keyTemp: 'temp',
        keyBright: 'bright',
        keyDir: 'dir',
        keyAButton: 'abutton',
        keyBButton: 'bButton',
        sendXAcceleration: false,
        sendYAcceleration: false,
        sendZAcceleration: false,
        sendAccelerationMagnitude: false,
        sendAllAcceleration: false,
        sendTemperature: false,
        sendBrightness: false,
        sendDirection: false,
        sendAButton: false,
        sendBButton: false,
    }

    public logRegion:HTMLElement = document.getElementById("log")  //find a way to work around this later

    
    /*
    componentWillReceiveProps(newProps) {
        if (newProps.visibilityState) {
            console.log('just received ', newProps.visibilityState)
        }
        /*
        console.log(newProps.visibilityState)
        if (newProps.visibilityState === false) {
            this.setState({
                visible: 'none',
            }, () => {
                console.log('set display of mbitpage to ', newProps.visibilityState);
                //this.props.changeView('mbitpage', false)    
            });
        }
        else if (newProps.visibilityState === true) {
            this.setState({
                visible: 'inline',
            }, () => {
                console.log('set display of mbitpage to ', newProps.visibilityState);
                //this.props.changeView('mbitpage', true)
            });
        }
    }
    */
    
    

    handleDataReceived = (key:string, value:any)  => {
        if (key == "input") {
            console.log('input received');
        }
    }

    handleClick() {
       console.log('Clicked');
    }

    appendToLog = (moreText:string) => {
        this.logRegion.innerHTML += moreText + "<br>";
    }

    toggleSend = (parameter:string) => {
        let sendParam = 'send' + parameter
        if (typeof this.mBitProps[sendParam] === 'boolean') {
            this.mBitProps[sendParam] = !this.mBitProps[sendParam]
            console.log(sendParam + ' toggled ', this.mBitProps[sendParam]);
        if (this.mBitProps[sendParam]){
            this.props.relayValue('microBit', 'mbitValue', parameter)
        }
            

        }
    }

    /** Might need to check key values later, but for now have them commented out as using 'send boolean values'*/

    parseMicroBit = (theInput:string) => {
        //let d = new Date()
        //console.log('new message ' + theInput + ' received at time ' + d.getMilliseconds())

        var split = theInput.split(":"); // for accelerometer data /// bluetooth uart write key/value pair
        var asNumber = parseInt(split[1]);

        //console.log('parsing was called with split[0] = ' + split[0] + ' and split[1] = ' + split[1]);
        if(split[0] === 'x'){
            //console.log(this.mBitProps.aData);
            this.mBitProps.aData.setX(asNumber);
            if(this.mBitProps.outputConnection != null && this.mBitProps.sendXAcceleration ) {//   this.mBitProps.keyX != null){
                this.mBitProps.outputConnection.send(this.mBitProps.keyX, this.mBitProps.aData.getScaledX());
            }
        }
        if(split[0] === 'y'){
            this.mBitProps.aData.setY(asNumber);
            if(this.mBitProps.outputConnection != null && this.mBitProps.sendYAcceleration) {//this.mBitProps.keyY != null){
                //console.log('sending KeyY: ' + this.mBitProps.keyY+ ', and value: ' + this.mBitProps.aData.getScaledY())
                this.mBitProps.outputConnection.send(this.mBitProps.keyY, this.mBitProps.aData.getScaledY());
            }
        }
        if(split[0] === 'z'){
            this.mBitProps.aData.setZ(asNumber);
            if(this.mBitProps.outputConnection != null && this.mBitProps.sendZAcceleration) {//this.mBitProps.keyZ !=null){
                this.mBitProps.outputConnection.send(this.mBitProps.keyZ, this.mBitProps.aData.getScaledZ());
            }
        }
        if(split[0] === 's'){
            this.mBitProps.aData.setS(asNumber);
            // after we get :s the packet is complete, time to send all
            if(this.mBitProps.outputConnection != null && this.mBitProps.sendAccelerationMagnitude){
                if(this.mBitProps.keyS != null)
                    this.mBitProps.outputConnection.send(this.mBitProps.keyS, this.mBitProps.aData.getScaledS());
                // send data array
                /*
                if(this.mBitProps.keyAll != null)
                    //console.log("keyAll: " + this.mBitProps.keyAll + ", adatascaled: " + this.mBitProps.aData.getScaledData());   
                    this.mBitProps.outputConnection.send(this.mBitProps.keyAll, this.mBitProps.aData.getScaledData()); 
                */
            }
        }
        if (this.mBitProps.outputConnection != null && this.mBitProps.sendAllAcceleration) {
            if(this.mBitProps.keyAll) {
                this.mBitProps.outputConnection.send(this.mBitProps.keyAll, this.mBitProps.aData.getScaledData());
            }
        }
        
        if(split[0] === 't'){
            this.mBitProps.tData.setTemp(asNumber);
            if (this.mBitProps.outputConnection !=null && this.mBitProps.sendTemperature) {//this.mBitProps.keyTemp != null) {
                this.mBitProps.outputConnection.send(this.mBitProps.keyTemp, this.mBitProps.tData.getScaledTemp())
            }
        }
        if(split[0] === 'b'){
            this.mBitProps.bData.setBrightness(asNumber);
            if (this.mBitProps.outputConnection !=null && this.mBitProps.sendBrightness) {//this.mBitProps.keyBright != null) {
                this.mBitProps.outputConnection.send(this.mBitProps.keyBright, this.mBitProps.bData.getScaledBrightness());
            }
        }
        if(split[0] === 'd'){
            this.mBitProps.dData.setDirection(asNumber);
            if (this.mBitProps.outputConnection !=null && this.mBitProps.sendDirection) {//this.mBitProps.keyDir!= null) {
                this.mBitProps.outputConnection.send(this.mBitProps.keyDir, this.mBitProps.dData.getScaledDirection());
            }
        }
        if(split[0] == '0') {
            this.mBitProps.aButton.setData(asNumber);
            if (this.mBitProps.outputConnection !=null && this.mBitProps.sendAButton) {//this.mBitProps.keyAButton != null) {
                //console.log('sending KeyAButton: ' + this.mBitProps.keyAButton + ', and abutton: ' + this.mBitProps.aButton)
                this.mBitProps.outputConnection.send(this.mBitProps.keyAButton, this.mBitProps.aButton)
            }
            else {
                //error handling
                //console.log('keyAButton: ' + keyAButton)
                //console.log('aButton: ' + aButton)
            }
        }
        if(split[0] == '1') {
            this.mBitProps.bButton.setData(asNumber);
            if (this.mBitProps.outputConnection !=null && this.mBitProps.sendBButton) {//this.mBitProps.keyBButton != null) {
                this.mBitProps.outputConnection.send(this.mBitProps.keyBButton, this.mBitProps.bButton)
                //console.log('sending keyBButton: ' + this.mBitProps.keyBButton + ', and bbutton: ' + this.mBitProps.bButton)
            }
            else {
                /* error handling
                console.log('keyBButton: ' + keyBButton)
                console.log('bButton: ' + bButton)
                */
            }
        }
        this.forceUpdate();
    }
    
    startReadingFromUART(mbit:bt.MicroBitUART){
        mbit.subscribeToMessages(this.parseMicroBit);
    }

    connectClicked = (e:React.MouseEvent<HTMLButtonElement>) => {

        navigator.bluetooth.requestDevice(bt.bluetoothSearchOptions).then(device => {
            console.log('Found: ' + device.name);
            //this.logRegion.innerHTML += 'Found: ' + device.name + "<br>";
            //this.appendToLog(`Found:  ${device.name}`);
            //console.log(device.gatt.connect())
            console.log(device.gatt);
            return device.gatt.connect()
        }).then(server => {
            //this.appendToLog("...connected!");
            console.log("...connected!");
            return server.getPrimaryService(bt.MBIT_UART_SERVICE);
        }).then(service => {
            return Promise.all([service.getCharacteristic(bt.MBIT_UART_RX_CHARACTERISTIC), 
                                    service.getCharacteristic(bt.MBIT_UART_TX_CHARACTERISTIC)])
        }).then(rxandtx => {
            let rx:BluetoothRemoteGATTCharacteristic;
            let tx:BluetoothRemoteGATTCharacteristic;
            [rx, tx] = rxandtx;
            let ourMicrobitUART = new bt.MicroBitUART(rx, tx);
            console.log(ourMicrobitUART);
            //this.appendToLog("Made a UART!!");
            console.log("Made a UART");
            //this.startReadingFromUART(ourMicrobitUART);
            //(ourMicrobitUART) => {

            ourMicrobitUART.subscribeToMessages(this.parseMicroBit);
            console.log('subscribing');
            //}
        }).catch(error => {
            console.log(error); 
        });
    }

    handleOutputConnection = (selection:string, type?:string) => {
        if (type == 'output') {
            if (this.mBitProps.outputConnection) {
                //if user is already outputing to a room (outputConnection already exists)
                this.mBitProps.outputConnection.p2pConnection.disconnect();
                console.log('disconnected from' + this.state.outputRoomName)
            }
            if (selection) {
                this.setState({
                    outputRoomName: selection,
                });

                this.mBitProps.outputConnection = getDataConnection(selection);
                console.log('A new output connection of name: ' + selection + ' was made');
                this.props.relayValue('microBit', 'output', selection)
            }
        }
    }

    toggleActive = () => {
        
    }
    
    render() {

        //console.log('mbitpage sees this.handleOutputConnection as ', this.handleOutputConnection)
        return (
            <div style={{display: this.props.visibilityState}}> 
                <br/>
                <div style={{display:'inline'}}>
                    <button onClick={ this.connectClicked }> 
                        Microbit Connect Button
                    </button>
                </div>
                    <button 
                        style={{float:'right'}} 
                        onClick={ () => this.props.changeView('boxLayout', false) }
                    >
                        Minimize
                    </button>
                <div id="log"></div>
                <div style={{whiteSpace: 'pre'}}>
                    {"accelerometer x: " + this.mBitProps.aData.getX()}
                    {"accelerometer y: " + this.mBitProps.aData.getY()}
                    {"accelerometer z: " + this.mBitProps.aData.getZ()}
                    {"accelerometer strength: " + this.mBitProps.aData.getS()}
                    {"abutton pressed: " + this.mBitProps.aButton.data}
                    {"bbutton pressed: " + this.mBitProps.bButton.data}
                </div>
                <br/>
                <div>
                    <MbitInterface 
                        handleSelection={this.handleOutputConnection}
                        toggleSend={this.toggleSend.bind(this)} 
                    />
                </div>
            </div>
        );
    }
}




