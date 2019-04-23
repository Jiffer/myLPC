import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
// p5.sound = require("p5/lib/addons/p5.sound")

// inputs
var nInput = 0;

var inputConnection = null;
var outputConnection = null;

function setupDataConnectionStuff() {
  // Elements
  var inputRoomForm = <HTMLFormElement> document.getElementById('input-room-form')
  var inputRoomBox = <HTMLInputElement> document.getElementById('input-room-box')
  var inputRoomSubmitButton = <HTMLInputElement> document.getElementById('input-room-button') 
  var outputRoomForm = <HTMLFormElement> document.getElementById('output-room-form')
  var outputRoomBox = <HTMLInputElement> document.getElementById('output-room-box')
  var outputRoomSubmitButton = <HTMLInputElement> document.getElementById('output-room-button') 
  

  let handleDataReceived = (key:string, value:any)=> {
    if (key == "note"){
        nInput = value; // currently data range needs to be scaled

        var fOut = getFrequency(nInput); // before sending it to the output connection convert to freq
        if(outputConnection != null){
            outputConnection.send("freq", fOut);
            
        }
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

    inputConnection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })
}

var ourSketch = new p5( (sketch) => {
    sketch.setup = () => {
        setupDataConnectionStuff();
        sketch.createCanvas(320, 240);        
    }

    sketch.draw = () => {
        sketch.background(200);
        
        //  convert to freq
        var fOut = getFrequency(nInput);

        sketch.text("note in: " + nInput, 10, 10);
        sketch.text("frequency out: " + fOut, 10, 20);

        
    }
});

////////////////////////////////////////////////////////////////////////////////////
// getFrequency()
// converts a MIDI note number to Frequency
// inspired by:
// https://sigusrone.com/articles/building-a-synth-with-the-web-audio-api-part-two 
////////////////////////////////////////////////////////////////////////////////////
function getFrequency(midi_code) {
  var offset_code = midi_code - 69;
  if (offset_code > 0) {
    return Number(440 * Math.pow(2, offset_code / 12));
  } else {
    return Number(440 / Math.pow(2, -offset_code / 12));
  }
}