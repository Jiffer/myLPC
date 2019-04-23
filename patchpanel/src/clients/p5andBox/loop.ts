import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

// input data from other rooms
let mode: number = 0; // input from machine learning - what is the current classification?

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
  // sliders stuff
  var sliderForm = <HTMLFormElement> document.getElementById('slider-form')
  var slider1 = <HTMLInputElement> document.getElementById('slider-1')
  var slider2 = <HTMLInputElement> document.getElementById('slider-2') 
  //don't allow people to send stuff until they choose a room
  slider1.disabled = true
  slider2.disabled = true

  

  // Receive messages from other rooms
  // input1, input2, slider1, slider2
  let handleDataReceived = (key:string, value:any)=> {
    if(key == "classification"){
        mode = parseInt(value);
        

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
    slider1.disabled = false; // allow sliders to work if an input or output room is specified
    slider2.disabled = false;

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
    slider1.disabled = false;
    slider2.disabled = false;

    inputConnection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })

  // send the data out when slider is touched
  slider1.addEventListener('input', function (e:Event) {
      outputConnection.send("slider1", slider1.value)
  })

  slider2.addEventListener('input', function (e:Event) {
      outputConnection.send("slider2", slider2.value)
  })
} // setupDataConnectionStuff()

//////////////////////////////////////////
// p5 sketch stuff
//////////////////////////////////////////
var loop1, loop2;
var lastMode;
var gain1, gain2;

var ourSketch = new p5( (sketch) => {
    // preload audio files
    sketch.preload = () => {
        loop1 = sketch.loadSound('cat-rats-loop.wav');
        loop2 = sketch.loadSound('bitcrushed-ambient.wav');
    }

    //////////////////////////////////////////
    // p5 sketch setup()
    //////////////////////////////////////////
    sketch.setup = () => {
        

        gain1 = new p5.Gain();
        gain2 = new p5.Gain();
        // use these
        gain1.connect();
        gain2.connect();
        // route through gain objects
        loop1.disconnect();
        loop2.disconnect();
        loop1.connect(gain1); 
        loop2.connect(gain2);
        // init to off
        gain1.amp(0, 0, 0);
        gain2.amp(0, 0, 0);
       
        loop1.loop();
        loop2.loop();

        setupDataConnectionStuff();
        sketch.createCanvas(320, 240);
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => {
        if (lastMode != mode){  
            lastMode = mode;

            sketch.text("mode: " + mode, 10, 10);
            if (mode == 0){
                sketch.background(0);
                gain1.amp(0, .25, 0);
                gain2.amp(0, .25, 0);
            }
            else if(mode == 1)
            {
                sketch.background(100);
                gain1.amp(1, .25, 0);
                gain2.amp(0, .25, 0);
            }
            else if(mode == 2 ){
                sketch.background(200);
                gain1.amp(0, .25, 0);
                gain2.amp(1, .25, 0);
            }
            else if(mode == 3){
                sketch.background(255);
                gain1.amp(1, .25, 0);
                gain2.amp(1, .25, 0);
            }
        }

        // Send things out to connection from p5 here
        if(outputConnection != null){
            // nada
        }
    }
});
