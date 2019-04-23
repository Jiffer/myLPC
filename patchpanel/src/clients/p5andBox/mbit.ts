import {getDataConnection} from '../client'
import * as mbit from '../../../dataTypes/myMbitData'
//import {Accelerometer} from '../../../dataTypes/accel'
import * as bt from '../bt'
//////////////////////////////
var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

let connectButton = document.getElementById("connectButton");
let logRegion = document.getElementById("log");
let ourMicrobitUART;

// input data from microbit
// HARDCODED FOR ACCELEROMTER
let aData = new mbit.accelerometerData;

// connection object vars
var inputConnection = null;
var outputConnection = null;

function setupDataConnectionStuff() {
  // Elements
  // input room stuff
  var inputRoomForm = <HTMLFormElement> document.getElementById('input-room-form')
  var inputRoomBox = <HTMLInputElement> document.getElementById('input-room-box')
  var inputRoomSubmitButton = <HTMLInputElement> document.getElementById('input-room-button') 
  // output room stuff
  var outputRoomForm = <HTMLFormElement> document.getElementById('output-room-form')
  var outputRoomBox = <HTMLInputElement> document.getElementById('output-room-box')
  var outputRoomSubmitButton = <HTMLInputElement> document.getElementById('output-room-button') 
  
  
  // Receive messages from other rooms
  let handleDataReceived = (key:string, value:any)=> {
    if (key == "input1"){ 
        
    }else{ 
        console.log("received unknown data key: " + key ) 
    }
  }

  inputRoomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + inputRoomBox.value)
    inputConnection = getDataConnection(inputRoomBox.value)
    inputRoomBox.disabled = true
    inputRoomSubmitButton.disabled = true

    inputConnection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })

  outputRoomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + outputRoomBox.value)
    outputConnection = getDataConnection(outputRoomBox.value)
    outputRoomBox.disabled = true
    outputRoomSubmitButton.disabled = true
    
    if (inputConnection != null) {
        inputConnection.onDataReceived((key:string, value:any)=>{
            handleDataReceived(key, value)
        })
    }
  })

 
} // setupDataConnectionStuff()

//////////////////////////////////////////
// p5 sketch stuff
//////////////////////////////////////////
var ourSketch = new p5( (sketch) => {
    //////////////////////////////////////////
    // p5 sketch setup()
    //////////////////////////////////////////
    sketch.setup = () => {
        setupDataConnectionStuff();
        sketch.createCanvas(320, 240);
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => {
        sketch.background(100);

        sketch.rect(0, sketch.height, 20, aData.data[0])
        
        // plot ellipse at mouse location
        sketch.fill(255);
        sketch.ellipse(sketch.mouseX, sketch.mouseY, 10, 10);

        // plot ellipse at remote mouse location
        sketch.fill(100, 0, 100);
        
        // Display data received as text 
        sketch.fill(0);
        if(aData != null){
            sketch.text("accelerometer x: " + aData.data[0], 10, 10);
            sketch.text("accelerometer y: " + aData.data[1], 10, 20);
            sketch.text("accelerometer z: " + aData.data[2], 10, 30);
            sketch.text("accelerometer strength: " + aData.data[3], 10, 40);
        }
        // Send things out to connection from p5 here
           
    }
});


function appendToLog(moreText:string){
    logRegion.innerHTML += moreText + "<br>";
}

function parseMicroBit(theInput:string){
    var split = theInput.split(":"); // for accelerometer data /// bluetooth uart write key/value pair
    var asNumber = parseInt(split[1]);
    
    if(split[0] === 'x'){
        aData.data[0] = asNumber;
    }
    if(split[0] === 'y'){
        aData.data[1] = asNumber;
    }
    if(split[0] === 'z'){
        aData.data[2] = asNumber;
    }
    if(split[0] === 's'){
        aData.data[3] = asNumber;
        if(outputConnection != null){
            outputConnection.send("accelerometer", aData);
        
        }
    }
}

function connectClicked(e:MouseEvent){
    navigator.bluetooth.requestDevice(bt.bluetoothSearchOptions).then(device => {
        appendToLog(`Found:  ${device.name}`);
        return device.gatt.connect();
    }).then(server => {
        appendToLog("...connected!");
        return server.getPrimaryService(bt.MBIT_UART_SERVICE);
    }).then(service => {
        return Promise.all([service.getCharacteristic(bt.MBIT_UART_RX_CHARACTERISTIC), 
                                service.getCharacteristic(bt.MBIT_UART_TX_CHARACTERISTIC)])
    }).then(rxandtx => {
        let rx:BluetoothRemoteGATTCharacteristic;
        let tx:BluetoothRemoteGATTCharacteristic;
        [rx, tx] = rxandtx;
        ourMicrobitUART = new bt.MicroBitUART(rx, tx);
        appendToLog("Made a UART!!");
        startReadingFromUART(ourMicrobitUART);
    }).catch(error => {
        console.log(error); 
    });
}

function startReadingFromUART(mbit:bt.MicroBitUART){
    mbit.subscribeToMessages(parseMicroBit);
}

connectButton.onclick = connectClicked;