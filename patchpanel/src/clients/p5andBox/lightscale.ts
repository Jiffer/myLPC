
import {getDataConnection} from '../client'
import {Indata} from "../../../dataTypes/connection"
import {Data} from "../../../dataTypes/data"
import {Pixel, Image, IPixel} from "../../../dataTypes/bitmap"


let p5 = require("p5")
p5.dom = require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

let capture;

let currentBright: number[] = [255, 255, 255]; //to see if difference in brightness from last iter
let inputBright: number[] = [255, 255, 255]; //for input updates

let inputConnection = null;
let outputConnection = null;

function setupDataConnectionStuff() {
    //input room
    let inputRoomForm = <HTMLFormElement> document.getElementById('input-room-form')
    let inputRoomName = <HTMLInputElement> document.getElementById('input-room-box') 
    let inputRoomSubmitButton = <HTMLInputElement> document.getElementById('input-room-button')
    //outputroom 
    let outputRoomForm = <HTMLFormElement> document.getElementById('output-room-form')
    let outputRoomName = <HTMLInputElement> document.getElementById('output-room-box') 
    let outputRoomSubmitButton = <HTMLInputElement> document.getElementById('output-room-button')

    let handleDataReceived = (key:string, value:any) => {
        //look for the 3 input rgb values B0, B1, B2
        if (key == "inputB0") {
            console.log("B0: " + value);
            inputBright[0] = value;
        }
        if (key == "inputB1") {
            console.log("B1: " + value);
            inputBright[1] = value;
        }
        if (key == "inputB2") {
            console.log("B2: " + value);
            inputBright[2] = value;
        }
        else {
            console.log("received unknown data key: " + key)
        }
    }
            
    inputRoomForm.addEventListener('submit', function(e:Event) {
        e.preventDefault();
        console.log("joining room " + inputRoomName.value);
        inputConnection = getDataConnection(inputRoomName.value);
        inputRoomName.disabled = true;  //makes form unclickable
        inputRoomSubmitButton.disabled = true; //makes button unclickable
        //do we want unclickable?? 
        
        inputConnection.onDataReceived((key:string, value:number[]) => {
            handleDataReceived(key, value);
        })
        
    })
    outputRoomForm.addEventListener('submit', function (e:Event) {
        e.preventDefault()
        console.log("joining room " + outputRoomName.value)
        outputConnection = getDataConnection(outputRoomName.value)
        outputRoomName.disabled = true
        outputRoomSubmitButton.disabled = true

        inputConnection.onDataReceived((key:string, value:number[])=>{
            handleDataReceived(key, value)
        })
    })
}

//instatiate RapidLib
let rapidMix  = window.RapidLib();
    
//Create a classification object
var myClassification = new rapidMix.Classification();

//This will hold mouse data (input) associated with an output value
var myTrainingSet = [];

var trained = false;

//train the model
function trainMe() {
    console.log('classification trained: ', myClassification.train(myTrainingSet));
    trained = true;
}

var classificationOutput;
function process(input) {
    classificationOutput = myClassification.process(input);
    if (classificationOutput == 2) console.log("Your screen is too dark");
}

//returns computed background canvas color
var brightness = function() {
    var p5canvas = document.getElementById("defaultCanvas0");
    var color = window.getComputedStyle(p5canvas, null).getPropertyValue("background-color");
    return color;
}

var myOutput = '(use number keys)';

//updates brightness
function getColor(brightness) {
    if (recordState) {
        var rapidInput = brightness;
        var rapidOutput = [myOutput];
        myTrainingSet.push({
            input: rapidInput,
            output: rapidOutput
        });
    }
    if (runState) {
        var rapidInput = brightness;
        process(rapidInput);
    }
}

var recordState;
function togRecord() {
    recordState = !recordState;
    trained = false;
    if (recordState) { console.warn("recording!");
    } else {
        console.log("stopped recording");
    }
}

var runState;
function togRun() {
    runState = !runState;
    if (runState) console.log("running");
    else console.log("stopped running");
}

function deleteEx() {
    myTrainingSet.length = 0;
    alert("cleared training set");
}

let ourSketch = new p5( (sketch) => {
    sketch.setup = () => {
        setupDataConnectionStuff();
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        
        capture = sketch.createCapture(sketch.VIDEO);
        // this is where we get the video! (createCapture)

        let dimen: number[] = [320, 240]
        capture.size(dimen[0], dimen[1]);
        capture.hide();
    }

    sketch.draw = () => {
        //load pixels
        capture.loadPixels();

        let dimen: number[] = [320, 240]
        let noPixels:number = capture.pixels.length / 360; //scales this
        let stepSize: number = 10;
        let brightness: number[] = [0, 0, 0]; //rgb

        for (let y=0; y<dimen[1]; y+=stepSize) {
            for (let x=0; x<dimen[0]-4; x+=stepSize) {
                let i:number = 4 * (y * dimen[0] + x);

                brightness[0] += capture.pixels[i];
                brightness[1] += capture.pixels[i+1];
                brightness[2] += capture.pixels[i+2];
            }
        }

        for (let i=0; i<3; i++) {
            brightness[i] = Math.round(brightness[i]/noPixels) + i*40;
        }
        //brightness calculation finished by here

        //come back and fix this so canvas window autoresizes
        function windowResized() {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight); 
        }

        //send brightness to output
        if (outputConnection != null) {
            outputConnection.send("inputB0", brightness[0])
            outputConnection.send("inputB1", brightness[1])
            outputConnection.send("inputB2", brightness[2])
        }

        //if just one screen sketch.background(brightness[0], brightness[1], brightness[2]);
        sketch.background(inputBright[0], inputBright[1], inputBright[2]);
        sketch.image(capture, 0, 0, dimen[0], dimen[1]);

        var canvas = document.querySelector("canvas");
        canvas.width = 600;
        canvas.height = 500;
        canvas.style.backgroundColor="rgb("+brightness[0]+","+brightness[1]+","+brightness[2]+")";
        var mlbox = canvas.getContext("2d");

        //ML Box record state info
        mlbox.font="18px Verdana"; 
        mlbox.strokeText('Press the following keys to toggle or start the Classification', 0, 40);
        mlbox.font="12px Verdana";
        
        if (recordState) {
          mlbox.strokeText('RECORDING! (x)', 0, 100);
        } else {
          mlbox.strokeText('x = record to toggle the record process based on myOutput', 0, 100);
        }
        if (trained) {
          mlbox.strokeText('(T)RAINED!', 0, 120);
        } else {
          mlbox.strokeText('t = train there are unused training examples', 0, 120);
        }
        if (runState) {
          mlbox.strokeText('(R)UNNING!', 0, 140);
        } else {
          mlbox.strokeText('r = run to toggle the run process on and off', 0, 140);
        }
        mlbox.strokeText('d = delete to delete Training Examples',0,80);
        if (classificationOutput == 2) mlbox.strokeText('LIGHTING TOO DARK!',0,160);
        mlbox.strokeText('classification output: ' + classificationOutput, 0, 180);

        mlbox.strokeText('myOutput: ' + myOutput, 0, canvas.height - 240);
        mlbox.strokeText('(' + brightness + ')' , 0, canvas.height - 220);

        //pushes new training example only if example is new during recording
        if (brightness != currentBright) {
            currentBright = brightness;
            getColor(brightness);
        }
    }

    //triggers on keypress when window is selected
    window.addEventListener("keypress", getKeyCode); 

    function getKeyCode(event) {
        console.log("made it here");
        console.log(event.keyCode);

        switch (event.keyCode) {
            case 120:
                togRecord();
                break;
            case 114:
                togRun();
                break;
            case 116:
                trainMe(); 
                break;
            case 100:
                deleteEx();
                break;
            default:
                //doesn't update myOutput unless number
                let numFiler:number = (event.keyCode - 48);
                if (numFiler < 11) {
                    myOutput = numFiler.toString();
                }
        }
    }
});
