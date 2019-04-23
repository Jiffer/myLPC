import {getDataConnection} from '../client'
import {data2D} from '../../../dataTypes/data2D'
//////////////////////////////////////////////
// inputs: none
// outputs: brightestPixelData, brightestX, brightestY
// TODO: stepSize as input parameter?
//////////////////////////////////////////////

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

// weighted average smoothing uses previous position and a wieght between 0:1
var pX, pY; 
var weight;

var capture;

// output keys
let keyBrightestX: string;
let keyBrightestY: string;

// this stores both the data and the key string to use 
let brightestPixel: data2D = new data2D("brightestpixel");

var connection = null;

function setupDataConnectionStuff() {
  // Elements
  var roomForm = <HTMLFormElement> document.getElementById('room-form')
  var roomBox = <HTMLInputElement> document.getElementById('room-box')
  var roomSubmitButton = <HTMLInputElement> document.getElementById('room-button') 
  // routing forms
    //   var _Form =  <HTMLFormElement> document.getElementById('-form')
    //   var _Box = <HTMLInputElement> document.getElementById('-box')
    //   var _Button = <HTMLInputElement> document.getElementById('-button') 
  var brightestPixelForm =  <HTMLFormElement> document.getElementById('brightestPixel-form')
  var brightestPixelBox = <HTMLInputElement> document.getElementById('brightestPixel-box')
  var brightestPixelButton = <HTMLInputElement> document.getElementById('brightestPixel-button') 
  var brightestXForm =  <HTMLFormElement> document.getElementById('brightestX-form')
  var brightestXBox = <HTMLInputElement> document.getElementById('brightestX-box')
  var brightestXButton = <HTMLInputElement> document.getElementById('brightestX-button') 
  var brightestYForm =  <HTMLFormElement> document.getElementById('brightestY-form')
  var brightestYBox = <HTMLInputElement> document.getElementById('brightestY-box')
  var brightestYButton = <HTMLInputElement> document.getElementById('brightestY-button') 
  

  let handleDataReceived = (key:string, value:any) => {
      // nothing to do with data
  }

  roomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + roomBox.value)
    connection = getDataConnection(roomBox.value)
    roomBox.disabled = true
    roomSubmitButton.disabled = true

    connection.onDataReceived((key:string, value:any) => {
        handleDataReceived(key, value)
    })
  })
  
  //// route forms to update keys // 3 outputs
   brightestPixelForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    brightestPixel.name = brightestPixelBox.value
  })
  brightestXForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    keyBrightestX = brightestXBox.value
  })
  brightestYForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    keyBrightestY = brightestYBox.value
  })
}

//////////////////////
// p5 sketch stuff
// built in functions/vars use sktech.____
//////////////////////
var ourSketch = new p5( (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(320, 240);

        capture = sketch.createCapture(sketch.VIDEO);
        capture.size(320, 240);
        capture.hide();
        // for weighted average
        pX = 0;
        pY = 0;
        weight = .85;

        setupDataConnectionStuff();
    } // end of sktech setup()

    sketch.draw = () => {
        // load pixels
        capture.loadPixels();

        sketch.background(200);
        sketch.image(capture, 0, 0, 320, 240); // 

        // initialize variables 
        var stepSize = 10;
        var brightestX = 0;
        var brightestY = 0;
        var brightestVal = 0
        var index = 0;
        for (var y=0; y<sketch.height; y+=stepSize) {
            for (var x=0; x<sketch.width; x+=stepSize) {
            var i = 4 * (y * sketch.width + x);
            
            var pixelValue = capture.pixels[i];
            pixelValue += capture.pixels[i+1];
            pixelValue += capture.pixels[i+2];
            pixelValue += capture.pixels[i+3];
            if( pixelValue > brightestVal)
            {
                brightestVal = pixelValue;
                index = i;
                brightestX = x;
                brightestY = y;
            }
            }     
        }

        // smooth data using previous location
        brightestPixel.setData(0,  (1 - weight) * brightestX + weight * pX);
        brightestPixel.setData(1,  (1 - weight) * brightestY + weight * pY);
        
        // save previous x, y position for next time around 
        pX = brightestPixel.data[0];
        pY = brightestPixel.data[1];
        
        // display
        sketch.ellipse(brightestPixel.data[0], brightestPixel.data[1], 20, 20);
        if(brightestPixel != null){
            sketch.text("accelerometer x: " + brightestPixel.data[0], 10, 10);
            sketch.text("accelerometer y: " + brightestPixel.data[1], 10, 20);
        }  

        // if connection exists send it out
        if(connection != null){
            if (brightestPixel.name != null){
                connection.send(brightestPixel.name, brightestPixel.getScaledData());  // only send after "key" is defined?
            }
            if (keyBrightestX != null){
                connection.send(keyBrightestX, brightestPixel.getScaled(0));
            }
            if (keyBrightestY != null){
                connection.send(keyBrightestY, brightestPixel.getScaled(1));
            }
        }
                
    } // end of sketch draw loop
});

