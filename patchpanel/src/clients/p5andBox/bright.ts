import {getDataConnection} from '../client'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")

var newX, newY, pX, pY;
var weight;
var capture;

var connection = null;

function setupDataConnectionStuff() {
  // Elements
  var roomForm = <HTMLFormElement> document.getElementById('room-form')
  var roomBox = <HTMLInputElement> document.getElementById('room-box')
  var roomSubmitButton = <HTMLInputElement> document.getElementById('room-button') 

  

  let handleDataReceived = (key:string, value:any)=> {
      // nothing to do with data

   /* if (key == "volume"){
        //amp = value/100.0;  //will arrive as 1-100
    }else{
        console.log("received unknown data key: " + key )
    }*/
  }

  roomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + roomBox.value)
    connection = getDataConnection(roomBox.value)
    roomBox.disabled = true
    roomSubmitButton.disabled = true

    connection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })
}

//////////////////////
// p5 sketch stuff
// built in functions/vars use sktech.____
//////////////////////
var ourSketch = new p5( (sketch) => {
    sketch.setup = () => {
        setupDataConnectionStuff();

        sketch.createCanvas(320, 240);

        capture = sketch.createCapture(sketch.VIDEO);
        capture.size(320, 240);
        capture.hide();

        newX = 0;
        newY = 0;
        pX = 0;
        pY = 0;
        weight = .85;
    } // end of sktech setup()

    sketch.draw = () => {
        // load pixels
        capture.loadPixels();

        sketch.background(200);
        sketch.image(capture, 0, 0, 320, 240); // 

        var stepSize = 10;
        var brightestX = 0;
        var brightestY = 0;
        var brightVal = -1
        var index = -1;
        for (var y=0; y<sketch.height; y+=stepSize) {
            for (var x=0; x<sketch.width; x+=stepSize) {
            var i = 4 * (y * sketch.width + x);
            
            var pixelValue = capture.pixels[i];
            pixelValue += capture.pixels[i+1];
            pixelValue += capture.pixels[i+2];
            pixelValue += capture.pixels[i+3];
            if( pixelValue > brightVal)
            {
                brightVal = pixelValue;
                index = i;
                brightestX = x;
                brightestY = y;
            }
            }     
        }

        newX = (1 - weight) * brightestX + weight * pX;
        newY = (1 - weight) * brightestY + weight * pY;
        
        // save previous x, y position for next time around 
        pX = newX;
        pY = newY;

        sketch.ellipse(newX, newY, 20, 20);

        // only if connection exists
        if(connection != null){
            connection.send("bX", newX);
            connection.send("note", newX * .2); // sending as duplicate with different address for now...
            connection.send("bY", newY);
        }
                
    } // end of sketch draw loop
});

