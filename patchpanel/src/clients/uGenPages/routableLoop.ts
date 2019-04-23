import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

// input data from other rooms
let loopMode: number = 0; // input from machine learning - what is the current classification?
let rate1: number = 1;
let rate2: number = 1;

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
  var rateSlider1 = <HTMLInputElement> document.getElementById('slider-1')
  var rateSlider2 = <HTMLInputElement> document.getElementById('slider-2') 

  
  // Receive messages from other rooms
  // input1, input2, slider1, slider2
  let handleDataReceived = (key:string, value:any)=> {
    if(key == "classification"){
        loopMode = parseInt(value);
        

    }else if (key == "rate1"){
        var clippedValue = 0;
        if (parseFloat(value) > 1){
            clippedValue = 1;
        }
        else if(parseFloat(value) < 0){
            clippedValue = 0.01;
        }
        else
        {
            clippedValue = parseFloat(value);
        }
        rateSlider1.value = value; // to set the current slider
        rate1 = (clippedValue);   // to store for p5
        
    }else if (key == "rate2"){
        var clippedValue = 0;
        if (parseFloat(value) > 1){
            clippedValue = 1;
        }
        else if(parseFloat(value) < 0){
            clippedValue = 0.01;
        }
        else
        {
            clippedValue = parseFloat(value);
        }
        rateSlider2.value = value; // to set the current slider
        rate2 = (clippedValue);

    }
    else if(key== "mode"){
        loopMode = value;
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

  // send the data out when slider is touched
  rateSlider1.addEventListener('input', function (e:Event) {
      //outputConnection.send("slider1", slider1.value)
      rate1 = parseFloat(rateSlider1.value);
  })

  rateSlider2.addEventListener('input', function (e:Event) {
      //outputConnection.send("slider1", slider1.value)
      rate2 = parseFloat(rateSlider2.value);
  })
} // setupDataConnectionStuff()

//////////////////////////////////////////
// p5 sketch stuff
//////////////////////////////////////////
var loop1, loop2;
var lastMode = 1;
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
        sketch.createCanvas(320, 340);
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => {
    sketch.background(200 - loopMode * 50);

        loop1.rate(rate1);
        loop2.rate(rate2);
        if (lastMode != loopMode){  
            lastMode = loopMode;
            
            
            console.log("mode: " + loopMode);
            if (loopMode == 0){
                
                gain1.amp(0, .25, 0);
                gain2.amp(0, .25, 0);
            }
            else if(loopMode == 1)
            {
            
                gain1.amp(1, .25, 0);
                gain2.amp(0, .25, 0);
            }
            else if(loopMode == 2 ){
                
                gain1.amp(0, .25, 0);
                gain2.amp(1, .25, 0);
            }
            else if(loopMode == 3){
                
                gain1.amp(1, .25, 0);
                gain2.amp(1, .25, 0);
            }
        }
        
        sketch.stroke(255);
        sketch.fill(255);
        sketch.text("mode: " + loopMode, 10, 10);
        sketch.text("rate1: " + rate1, 10, 20);
        sketch.text("rate2: " + rate2, 10, 30);

        sketch.stroke(0);
        sketch.rect(0, 240, sketch.width, 100);
        for(var i = 0; i < 4; i++){
            if (loopMode == i){
                sketch.fill(10, 50, 20);
            }
            else{
               sketch.fill(200);
            }
            sketch.rect(i*sketch.width/4, 240, sketch.width/4-1, 100-1);
        }
        
    }

    // mouse check
    sketch.mouseReleased = () => {
        if(sketch.mouseY > 240 && sketch.mouseY < 340){
            if(sketch.mouseX > 0 && sketch.mouseX < 320){
                loopMode = Math.floor(sketch.mouseX / (sketch.width/4));
                console.log(loopMode);
            }
        }        
    }  
});
