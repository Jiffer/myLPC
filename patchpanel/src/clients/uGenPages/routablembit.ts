import {getDataConnection} from '../client'
import * as mbit from '../../../dataTypes/myMbitData'
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
let tData = new mbit.temperatureData;
let bData = new mbit.brightnessData;
let dData = new mbit.directionData;
let aButton = new mbit.aButton;
let bButton = new mbit.bButton;
// output key defaults
let keyAll: string;
let keyX: string;
let keyY: string;
let keyZ: string;
let keyS: string;
let keyTemp: string;
let keyBright: string;
let keyDir: string;
let keyAButton: string;
let keyBButton: string;

// connection object vars
var outputConnection = null;

function setupDataConnectionStuff() {
  // Elements
  // output room stuff
  let outputRoomForm = <HTMLFormElement> document.getElementById('output-room-form')
  let outputRoomBox = <HTMLInputElement> document.getElementById('output-room-box')
  let outputRoomSubmitButton = <HTMLInputElement> document.getElementById('output-room-button') 
  
  // routing buttons
  let accelAllForm =  <HTMLFormElement> document.getElementById('accelall-form')
  let accelAllBox = <HTMLInputElement> document.getElementById('accelall-box')
  let accelAllSubmitButton = <HTMLInputElement> document.getElementById('accelall-button') 
  let accelXForm =  <HTMLFormElement> document.getElementById('accelx-form')
  let accelXBox = <HTMLInputElement> document.getElementById('accelx-box')
  let accelXSubmitButton = <HTMLInputElement> document.getElementById('accelx-button') 
  let accelYForm =  <HTMLFormElement> document.getElementById('accely-form')
  let accelYBox = <HTMLInputElement> document.getElementById('accely-box')
  let accelYSubmitButton = <HTMLInputElement> document.getElementById('accely-button') 
  let accelZForm =  <HTMLFormElement> document.getElementById('accelz-form')
  let accelZBox = <HTMLInputElement> document.getElementById('accelz-box')
  let accelZSubmitButton = <HTMLInputElement> document.getElementById('accelz-button') 
  let accelSForm =  <HTMLFormElement> document.getElementById('accels-form')
  let accelSBox = <HTMLInputElement> document.getElementById('accels-box')
  let accelSSubmitButton = <HTMLInputElement> document.getElementById('accels-button') 
  let tempForm =  <HTMLFormElement> document.getElementById('temp-form')
  let tempBox = <HTMLInputElement> document.getElementById('temp-box')
  let tempSubmitButton = <HTMLInputElement> document.getElementById('temp-button') 
  let brightForm =  <HTMLFormElement> document.getElementById('bright-form')
  let brightBox = <HTMLInputElement> document.getElementById('bright-box')
  let brightSubmitButton = <HTMLInputElement> document.getElementById('bright-button') 
  let directionForm =  <HTMLFormElement> document.getElementById('direction-form')
  let directionBox = <HTMLInputElement> document.getElementById('direction-box')
  let directionSubmitButton = <HTMLInputElement> document.getElementById('direction-button') 
  let aButtonForm =  <HTMLFormElement> document.getElementById('a-button-form')
  let aButtonBox = <HTMLInputElement> document.getElementById('a-button-box')
  let aButtonSubmitButton = <HTMLInputElement> document.getElementById('a-button') 
  let bButtonForm =  <HTMLFormElement> document.getElementById('b-button-form')
  let bButtonBox = <HTMLInputElement> document.getElementById('b-button-box')
  let bButtonSubmitButton = <HTMLInputElement> document.getElementById('b-button') 

  
  // Receive messages from other rooms
  let handleDataReceived = (key:string, value:any)=> {
    if (key == "input"){ 
        
    }else{ 
        console.log("received unknown data key: " + key ) 
    }
  }

  
  outputRoomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + outputRoomBox.value)
    outputConnection = getDataConnection(outputRoomBox.value)
    outputRoomBox.disabled = true
    outputRoomSubmitButton.disabled = true
  })

   accelAllForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("sending accelerometerData to key: " + accelAllBox.value)
    keyAll = accelAllBox.value
  })

  accelXForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("sending accelerometerXData to key: " + accelXBox.value)
    keyX = accelXBox.value
  })
  accelYForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("sending accelerometerYData to key: " + accelYBox.value)
    keyY = accelYBox.value
  })
  accelZForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("sending accelerometerZData to key: " + accelZBox.value)
    keyZ = accelZBox.value
  })
  accelSForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("sending accelerometerSData to key: " + accelSBox.value)
    keyS = accelSBox.value
  })

  tempForm.addEventListener('submit', function (e:Event) {
      e.preventDefault()
      console.log("sending temperatureData to key: " + tempBox.value)
      keyTemp = tempBox.value
  })

  brightForm.addEventListener('submit', function (e:Event) {
      e.preventDefault()
      console.log("sending brightnessData to key: " + brightBox.value)
      keyBright = brightBox.value
  })

  directionForm.addEventListener('submit', function (e:Event) {
      e.preventDefault()
      console.log("sending directionData to key: " + directionBox.value)
      keyDir = directionBox.value
  })

  aButtonForm.addEventListener('submit', function (e:Event) {
      e.preventDefault()
      console.log("sending directionData to key: " + aButtonBox.value)
      keyAButton = aButtonBox.value
  })

  bButtonForm.addEventListener('submit', function (e:Event) {
      e.preventDefault()
      console.log("sending directionData to key: " + bButtonBox.value)
      keyBButton = bButtonBox.value
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

        
        // Display data received as text 
        sketch.fill(0);
        if(aData != null){
            sketch.rect(10, sketch.height, 40, 240 * aData.getScaledX())
            sketch.rect(70, sketch.height, 40, 240 * aData.getScaledY() )
            sketch.rect(130, sketch.height, 40, 240 * aData.getScaledZ())
            sketch.rect(180, sketch.height, 40, 240 * aData.getScaledS())

            sketch.text("accelerometer x: " + aData.getX(), 10, 10);
            sketch.text("accelerometer y: " + aData.getY(), 10, 20);
            sketch.text("accelerometer z: " + aData.getZ(), 10, 30);
            sketch.text("accelerometer strength: " + aData.getS(), 10, 40);
            sketch.text("temperature in C: " + tData.getTemp(), 10, 50);
            sketch.text("brightness: " + bData.getBrightness(), 10, 60);
            sketch.text("direction in degrees: " + dData.getDirection(), 10, 70);
            sketch.text("abutton pressed: " + aButton.data, 10, 80)
            sketch.text("bbutton pressed: " + bButton.data, 10, 90)
        }      
    }
});


function appendToLog(moreText:string){
    logRegion.innerHTML += moreText + "<br>";
}

// Microbit data comes in as a string, : is the delimiter
function parseMicroBit(theInput:string){
    var split = theInput.split(":"); // for accelerometer data /// bluetooth uart write key/value pair
    var asNumber = parseInt(split[1]);
    
    if(split[0] === 'x'){
        aData.setX(asNumber);
        if(outputConnection != null && keyX != null){
            outputConnection.send(keyX, aData.getScaledX());
        }
    }
    if(split[0] === 'y'){
        aData.setY(asNumber);
        if(outputConnection != null && keyY != null){
            console.log('sending KeyY: ' + keyY+ ', and value: ' + aData.getScaledY())
            outputConnection.send(keyY, aData.getScaledY());
        }
    }
    if(split[0] === 'z'){
        aData.setZ(asNumber);
        if(outputConnection != null && keyZ !=null){
            outputConnection.send(keyZ, aData.getScaledZ());
        }
    }
    if(split[0] === 's'){
        aData.setS(asNumber);
        // after we get :s the packet is complete, time to send all
        if(outputConnection != null){
            if(keyS != null)
                outputConnection.send(keyS, aData.getScaledS());
            // send data array
            if(keyAll != null)
                console.log("keyAll: " + keyAll + ", adatascaled: " + aData.getScaledData());   
                outputConnection.send(keyAll, aData.getScaledData()); 
        }
    }
    
    if(split[0] === 't'){
        tData.setTemp(asNumber);
        if (outputConnection !=null && keyTemp != null) {
            outputConnection.send(keyTemp, tData.getScaledTemp())
        }
    }
    if(split[0] === 'b'){
        bData.setBrightness(asNumber);
        if (outputConnection !=null && keyBright != null) {
            outputConnection.send(keyBright, bData.getScaledBrightness());
        }
    }
    if(split[0] === 'd'){
        dData.setDirection(asNumber);
        if (outputConnection !=null && keyDir!= null) {
            outputConnection.send(keyDir, dData.getScaledDirection());
        }
    }
    if(split[0] == '0') {
        aButton.setData(asNumber);
        if (outputConnection !=null && keyAButton != null) {
            console.log('sending KeyAButton: ' + keyAButton + ', and abutton: ' + aButton)
            outputConnection.send(keyAButton, aButton)
        }
        else {
            //error handling
            //console.log('keyAButton: ' + keyAButton)
            //console.log('aButton: ' + aButton)
        }
    }
    if(split[0] == '1') {
        bButton.setData(asNumber);
        if (outputConnection !=null && keyBButton != null) {
            outputConnection.send(keyBButton, bButton)
            console.log('sending keyBButton: ' + keyBButton + ', and bbutton: ' + bButton)
        }
        else {
            /* error handling
            console.log('keyBButton: ' + keyBButton)
            console.log('bButton: ' + bButton)
            */
        }
    }
}

////// Bluetooth Connect //////
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