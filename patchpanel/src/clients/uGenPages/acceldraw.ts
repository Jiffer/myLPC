import {getDataConnection} from '../client'
import * as mbit from '../../../dataTypes/myMbitData'
import * as bt from '../bt'

var p5 = require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

let prevData = new mbit.accelerometerData();
let inputs = new mbit.accelerometerData();
let inputConnection = null;

function setupDataConnectionStuff() {
  // Elements
  // input room stuff
    let inputRoomForm = <HTMLFormElement> document.getElementById('input-room-form')
    let inputRoomBox = <HTMLInputElement> document.getElementById('input-room-box')
    let inputRoomSubmitButton = <HTMLInputElement> document.getElementById('input-room-button') 


    let handleDataReceived = (key:string, value:any)=> {
        if (key == "input"){ 
        console.log("do something here");
        }
        else if (key == "draw") {
            console.log("draw received");
            if (inputs) {
                prevData.data = inputs.data
            }
            inputs.data = [(value[0]*4096)-2048, (value[1]*4096)-2048,(value[2]*4096)-2048, value[3]*2048]
            //rescale data
        }
        else{ 
            console.log("received unknown data key: " + key ) 
        }
    }

    inputRoomForm.addEventListener('submit', function (e:Event) {
        e.preventDefault()
        console.log("joining room " + inputRoomBox.value)
        inputConnection = getDataConnection(inputRoomBox.value)
        inputRoomBox.disabled = true
        inputRoomSubmitButton.disabled = true

        inputConnection.onDataReceived((key:string, value:any) => {
            handleDataReceived(key, value)
        })
    });

}

var ourSketch = new p5( (sketch) => {
    //////////////////////////////////////////
    // p5 sketch setup()
    //////////////////////////////////////////
    sketch.setup = () => {
        setupDataConnectionStuff();
        sketch.createCanvas(1500, 700);
        sketch.background(140);
        sketch.stroke(255)
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => {
        // Display data received as text 
        sketch.fill(0);
        //if (prevData.data == null) {console.log("prev is null");}
        //console.log("inputs: " + inputs.data)
        //console.log("prevdata: " + prevData.data)
        //console.log("inputs comp: " + inputs.data == null)
        //console.log("prevdata comp: " + prevData.data == null)
        sketch.ellipse(inputs.data[0], inputs.data[1])
        sketch.line(prevData.data[0], prevData.data[1], inputs.data[0], inputs.data[1])
    }
    
});