import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")

// Globals
var newNote = [false, false, false, false, false, false, false, false, false, false, false, false];
var amp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var noteMap = [ 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 66, 67]; // the scale

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
  // input1, input2, slider1, slider2
  let handleDataReceived = (key:string, value:any)=> {
    if (key == "midi"){ 
        amp[value.index] = value.velocity; // capture incoming amplitude value
        // newNote[value.index] = true;
        if(outputConnection != null){ // pass it straight through
            outputConnection.send("midi", {
                'index': value.index,
                'note': noteMap[value.index], 
                'velocity': amp[value.index]	
            });
           //console.log("sending i:" + value.index +" map: " +  noteMap[value.index] +"a: " + amp[value.index])
        }      
    }else{ // Should this data be automatically passed to an output connection?
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
        
        // plot ellipse at mouse location
        sketch.fill(255);
        sketch.ellipse(sketch.mouseX, sketch.mouseY, 10, 10);
    }
});
