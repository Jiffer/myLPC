import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

console.log("hello")
// input data from other rooms
var input1 = 0;
var input2 = 0;
var sliderData1 = 0;
var sliderData2 = 0;

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
    if (key == "input1"){ 
        input1 = value; 
    }else if (key == "input2"){
        input2 = value;
    }else if (key == "slider1"){
        slider1.value = value; // to set the current slider
        sliderData1 = value;   // to store for p5
    }else if (key == "slider2"){
        slider2.value = value;
        sliderData2 = value;
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

        // plot ellipse at remote mouse location
        sketch.fill(100, 0, 100);
        sketch.ellipse(input1, input2, 10, 10);

        // Display data received as text 
        sketch.fill(0);
        sketch.text("received input1: " + input1, 10, 10);
        sketch.text("received input2: " + input2, 10, 20);
        sketch.text("received slider1: " + sliderData1, 10, 30);
        sketch.text("received slider2: " + sliderData2, 10, 40);

        // Send things out to connection from p5 here
        if(outputConnection != null){
            outputConnection.send("input1", sketch.mouseX);
            outputConnection.send("input2", sketch.mouseY);
        }
    }
    // TODO: Figure out how to use a built in p5 function such as mouseReleased
      sketch.mouseReleased = () => {
        
      }        

});
