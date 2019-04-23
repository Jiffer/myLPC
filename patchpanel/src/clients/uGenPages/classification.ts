import {getDataConnection} from '../client'


var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

// input data from other rooms
let remoteInput: number[];
let useRemote: boolean = false; 

// connection object vars
var inputConnection = null;
var outputConnection = null;

// output keys
let keyClassificationOutput: string;

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
  
  var classifiedOutputForm =  <HTMLFormElement> document.getElementById('classifiedOutput-form')
  var classifiedOutputBox = <HTMLInputElement> document.getElementById('classifiedOutput-box')
  var classifiedOutputButton = <HTMLInputElement> document.getElementById('classifiedOutput-button') 

// this stores both the data and the key string to use 
 //    let brightestPixel: data2D = new data2D("brightestpixel");

  // Receive messages from other rooms
  // input1, input2, slider1, slider2
  let handleDataReceived = (key:string, value:any)=> {
    //   console.log("key: " + key);
    if (key === "classifyMe"){ 
        //console.log("value: " + value.length);
        remoteInput = value;
        
    }else{ // Should this data be automatically passed to an output connection?
        // console.log("received unknown data key: " + key  + " value: " + value); 
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
  })

  //// route forms to update keys // 3 outputs
   classifiedOutputForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    keyClassificationOutput = classifiedOutputBox.value
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

function clearMe() {
    myTrainingSet = [];
    trained = false;
}

//Run the classifier on current input
let classificationOutput: number[];
function process(input) {
    classificationOutput = myClassification.process(input);
}

// machine learning output
let myOutput: number;

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
let xOffset:number = 200;
let yOffset:number = 100;
var ourSketch = new p5( (sketch) => {
    //////////////////////////////////////////
    // p5 sketch setup()
    //////////////////////////////////////////
    sketch.setup = () => {
        setupDataConnectionStuff();
        sketch.createCanvas(520, 340); // video is 320x240
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => {
        sketch.background(100);

        sketch.fill(200);
        sketch.noStroke();
        sketch.rect(0, 0, 520, yOffset);
        sketch.rect(0, yOffset, xOffset, 240);
        sketch.stroke(0);
        sketch.noFill();
        sketch.rect(xOffset, yOffset, 320-1, 240-1);

        // plot ellipse at remote brightness location
        sketch.fill(100, 0, 100);
        
        let rapidInput: number[];
        
        sketch.stroke(0);
        sketch.text("use mouse", 10, 20)
        sketch.text("use remote", 100, 20)
        // draw selection box
        sketch.noFill();
        sketch.stroke(0);
        sketch.rect(50, 30, 40, 10);
        if (remoteInput != null){
            sketch.fill(0);
        }
        else{
            sketch.stroke(100);
            sketch.fill(100)
        }

        if (useRemote && (remoteInput != null)){
            rapidInput = remoteInput;
            sketch.rect(70, 25, 20, 20);
        }
        else{
            rapidInput = [sketch.mouseX - xOffset, sketch.mouseY - yOffset];
            sketch.rect(50, 25, 20, 20);
        }

        // display input data
        sketch.stroke(0);
        for (var i = 0; i < rapidInput.length; i++){
            sketch.text("input " + i + ": " + rapidInput[i] + " ",  10, 60 + i * 10 + yOffset);
        }

        if (rapidInput.length == 2){
            sketch.ellipse(rapidInput[0]*320 + xOffset, rapidInput[1]*240 + yOffset, 10, 10) // data is scaled to 0:1
        }
        
        // Display data received as text 
        sketch.stroke(0);
        if(recordState){
            sketch.text("RECORDING (x)", 10, 10 + yOffset);

            let rapidOutput:number[] = [myOutput];
            myTrainingSet.push({
                input: rapidInput,
                output: rapidOutput
            });
        }
        else
            sketch.text("x = record", 10, 10 + yOffset);
        if (trained){
            sketch.text("Trained! (c = clear)", 10, 20 + yOffset);
            // TODO display trained input / output data (for x, y)
        }
        else
            sketch.text("t = train", 10, 20 + yOffset);
        if (running){
            process(rapidInput);
            sketch.text("RUNNING ", 10, 30 + yOffset);
            sketch.text('classification output: ' + classificationOutput, 10, 40 + yOffset);
        }
        else{
            sketch.text("r = run ", 10, 30 + yOffset);
            sketch.text("my output: " + myOutput, 10, 40 + yOffset);
        }   
        

        // Send things out to connection from p5 here
        if(outputConnection != null && running && keyClassificationOutput != null){
            outputConnection.send(keyClassificationOutput, classificationOutput);
        }
         
    }

      sketch.keyPressed = () => {
        console.log("key code: " + sketch.keyCode);

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
            case 67: // c
                clearMe();
                break;
            default: // otherwise check if its number key 0-9
                let asNumber: number = sketch.keyCode - 48;
                if ((asNumber >= 0 ) && (asNumber < 10)){
                    myOutput = asNumber;
                    if(outputConnection != null && !running && keyClassificationOutput != null){
                        outputConnection.send(keyClassificationOutput, myOutput);
                    }
                }
               
        }

      }    
      sketch.mouseReleased = () => {
          if(sketch.mouseX > 50 && sketch.mouseX < 90 && sketch.mouseY > 30 && sketch.mouseY < 50){
            useRemote = !useRemote;
            console.log(useRemote);
          }
      }      

});
