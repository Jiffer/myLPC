import {getDataConnection} from '../client'
import {accelerometerData} from '../../../dataTypes/myAccelerometerData'



var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

// input data from other rooms
var bX = 0; 
var bY = 0;
let aData = new accelerometerData;
let mode: string = "bright";

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
    if (key == "bX"){ 
        bX = value; 
    }else if (key == "bY"){
        bY = value;
    }if (key == "accelerometer"){
        mode = "accel"; // change mode for acceleromteter data
        aData = value;
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


////////////////////////////////////  RAPID MIX API stuff
//create an instance of the library
//let theBrowserWindow:Window = <Window>window;
let rapidMix = window.RapidLib();

//Create a classification object
let myClassification = new rapidMix.Classification();

//This will hold mouse data (input) associated with an output value
var myTrainingSet = [];

//Train the model
var trained = false;
function trainMe() {
    myClassification.train(myTrainingSet)
    // console.log('classification trained: ',myClassification.train(myTrainingSet));
    trained = true;
}

//Run the classifier on current mouse x and y
var classificationOutput;
function process(input) {
    classificationOutput = myClassification.process(input);
}

// machine learning output
var mlOutput;

// ml functions 
var recordState = false;
function togRecord() {
    recordState = !recordState;
    if (recordState) {
    console.warn("recording!");
    } else {
        console.log("stopped recording");
    }
}

var running;
function togRun() {
    running = !running;
    if(running)
    console.log("running"); 
    else
    console.log("stopped running");
}

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
        

        // plot ellipse at remote brightness location
        sketch.fill(100, 0, 100);
        if(mode === "bright"){
            sketch.ellipse(bX, bY, 10, 10);
        }
        else if(mode === "accel"){
            sketch.ellipse(aData.data.x * .25, aData.data.y * .25, 10, 10);
            sketch.text("x :" + aData.data.x, 10, 60);
            sketch.text("y :" + aData.data.y, 10, 70);
            sketch.text("z :" + aData.data.z, 10, 80);
            sketch.text("strength :" + aData.data.s, 10, 90);
            // console.log(aData);
        }

        // feed the remote x/y into classifier:
        //Adding mouse position to training set, if recording
        if (recordState) {
            let rapidInput: number[];
            if (mode === "bright"){
             rapidInput = [bX, bY];
            }
            else if(mode === "accel"){
                rapidInput = [aData.data.x, aData.data.y, aData.data.z];
            }
            
            let rapidOutput:number[] = [mlOutput];
            myTrainingSet.push({
                input: rapidInput,
                output: rapidOutput
            });
        }
        
        //Process the bx/by position, if the model is running
        if (running) {
            let rapidInput: number[];
            if (mode === "bright"){
             rapidInput = [bX, bY];
            }
            else if(mode === "accel"){
                rapidInput = [aData.data.x, aData.data.y, aData.data.z];
            }
            process(rapidInput);
        }

        // Display data received as text 
        sketch.fill(0);
        if(recordState)
            sketch.text("RECORDING (x)", 10, 10);
        else
            sketch.text("x = record", 10, 10);
        if (trained)
            sketch.text("Trained!", 10, 20);
        else
            sketch.text("t = train", 10, 20);
        if (running){
            sketch.text("RUNNING ", 10, 30);
            sketch.text('classification output: ' + classificationOutput, 10, 200);
        }
        else
            sketch.text("r = run ", 10, 30);
        
        sketch.text("output: " + mlOutput, 10, 40);
        

        // Send things out to connection from p5 here
        if(outputConnection != null && running){
            outputConnection.send("classification", classificationOutput);
        }
         
    }

      sketch.keyPressed = () => {
        
        switch(sketch.keyCode){
            
            case 88: // x
                togRecord();
                break;
            case 82: // r
                togRun();
                break;
            case 84: // t
                trainMe();
                break;
            default:
                mlOutput = sketch.keyCode - 48;
                if(outputConnection != null && !running){
                    outputConnection.send("classification", mlOutput);
                }
               
        }

      }        

});
