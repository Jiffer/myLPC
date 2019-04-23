import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

var qInput1 = 0;
var qInput2 = 0;
var qNote = 0;
var max = 127;

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
    if (key == "bX"){
        qInput1 = value;
    }else if (key == "bY"){
        qInput2 = value;
    }else if (key == "note"){
        qNote = value;
    }else if (key == "max"){
        max = value;
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
        sketch.fill(255);
        sketch.ellipse(qInput1, qInput2, 10, 10); // all about appearances
        var qOutput1 = Math.round(qNote); // truncate to quantize to integer note value
        
        sketch.fill(255, 10);
        sketch.rect(0, 0, sketch.width-1, sketch.height-1);

        // Send things out from p5 here:
        if(outputConnection != null){
            //outputConnection.send("messageName", outputDataValue);
            outputConnection.send("note", qOutput1);
        }
    }
});

