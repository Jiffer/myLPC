import {getDataConnection} from '../client'
import {JifferSeqMidi} from '../../../dataTypes/midi'

var p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")

// input data from other rooms
var tempoSliderValue = 0;
var play = false;
var currentBeat = 0;

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
  var slider1 = <HTMLInputElement> document.getElementById('tempoSlider')
  var runBox = <HTMLInputElement> document.getElementById('runBox') 
  

  // Receive messages from other rooms
  // input1, input2, slider1, slider2
  let handleDataReceived = (key:string, value:any)=> {
    if (key == "currentbeat"){ 
        currentBeat = value; 
    }else if (key == "tempo"){
        slider1.value = value; // to set the current slider
        tempoSliderValue = parseFloat(value);   // to store for p5 // do some math.. to make bpm
    }else if (key == "play"){
        runBox.value = value;
        if(parseInt(value) == 0){
            play = false;
        }else if (parseInt(value) == 1){
            play = true;
        }
    }else{ // Should this data be automatically passed to an output connection?
        console.log("unknown data key: " + key + " value: " + value) 
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
    slider1.disabled = false;
    runBox.disabled = false;
  })

  // update slider data
  slider1.addEventListener('click', function (e:Event) {
      tempoSliderValue = parseFloat(slider1.value);
      
  })

  runBox.addEventListener('click', function () {
      play = runBox.checked; // update play variable
  })
} // setupDataConnectionStuff()

//////////////////////////////////////////
// p5 sketch stuff
//////////////////////////////////////////
var ourSketch = new p5( (sketch) => {
    // p5 vars
    var seqGrid;
    var lastTime = 0;
    var lastFrameMouseDown = false;
    //////////////////////////////////////////
    // p5 sketch setup()
    //////////////////////////////////////////
    sketch.setup = () => {
        setupDataConnectionStuff();
        sketch.createCanvas(320, 240);
        seqGrid = new Grid(16, 12, 320, 240);
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => { // TODO: allow dragging to enable multiple steps
        
       sketch.background(200);
        
        // draw sequencer
        seqGrid.display();
        seqGrid.checkMouse();
        // draw beat indicator
        if(play){
            var currentTime = sketch.millis();
            
            if (currentTime - lastTime > (tempoSliderValue*150 + 50)){
                lastTime = currentTime;
                currentBeat++;
                currentBeat %= seqGrid.numSteps;

                // Send things out to connection from p5 here
                if(outputConnection != null){ // send a JSON packet
                    
                        for (var j = 0; j < seqGrid.numChannels; j++){
                            //console.log(currentBeat*seqGrid.numChannels + j);
                            if(seqGrid.stepActive(currentBeat, j)){
                                //if particular table index is on
                                let mididata = new JifferSeqMidi((seqGrid.numChannels - 1) - j, -1, 127)
                                outputConnection.send(mididata.type, mididata.data)
                                // console.log((seqGrid.numChannels - 1) - j)
                            }
                        }
                }
            }
        }

        // Display data received as text 
        sketch.fill(0);
       
        
    }
    ////////////////////////////////////////////////////////////
    // Grid()
    // Grid of Steps
    // specify how many steps (beats) 
    // and Channels, (voices / notes) - and draw size
    ////////////////////////////////////////////////////////////
    function Grid(numSteps, numChannels, gridWidth, gridHeight){
        
        this.numSteps = numSteps;
        this.numChannels = numChannels;
        this.stepWidth = gridWidth/numSteps;
        this.stepHeight = gridHeight/(numChannels+1);
        this.steps = [];
        for(var i = 0; i < numSteps; i++){
            for (var j = 0; j < numChannels; j++){
                //console.log(i + " " + j);
                this.steps.push(new Step(this.stepWidth * i, this.stepHeight * j, this.stepWidth, this.stepHeight));
            }
        }

        this.display = function(){
            for(var i = 0; i < numSteps; i++){
                for (var j = 0; j < numChannels; j++){
                    this.steps[i*numChannels + j].display();
                }
            }
            // draw beat indicator
            for(var i = 0; i < numSteps; i++){
                if (play == false){
                    sketch.fill(255);
                }
                else{
                    if (currentBeat == i){
                        sketch.fill(75);
                    }
                    else{
                        sketch.fill(255);
                    }
                }
                sketch.rect(i * this.stepWidth, numChannels * this.stepHeight + 9, this.stepWidth, this.stepHeight-10);
            }
        }

        this.stepActive = function(col, row){
            return this.steps[col*numChannels + row].on;   
        }
        

        this.checkMouse = function(){
            if(lastFrameMouseDown == false && sketch.mouseIsPressed){// new press
                // check if within grid
                if (sketch.mouseX < sketch.width && sketch.mouseY < sketch.height){
                    // check if clicking a step object
                    for(var i = 0; i < numSteps; i++){
                        for (var j = 0; j < numChannels; j++){    
                           this.steps[i*numChannels + j].checkMouse();
                        }
                    }

                }
                else if(sketch.mouseX > sketch.width){ // click right of canvas to randomize
                    for(var i = 0; i < numSteps; i++){
                        for (var j = 0; j < numChannels; j++){
                            if(sketch.random(100) > 70){
                                this.steps[i*numChannels + j].setOn();
                            }
                            else{
                                this.steps[i*numChannels + j].setOff();
                            }
                        }
                    }
                }
                else if(sketch.mouseY > sketch.height){ // click below the canvas to clear
                    for(var i = 0; i < numSteps; i++){
                        for (var j = 0; j < numChannels; j++){
                            
                            this.steps[i*numChannels + j].setOff();
                            
                        }
                    }
                }
            }
            lastFrameMouseDown = sketch.mouseIsPressed; // save current for next time
        }
    }
    ////////////////////////////////////////////////////////////
    // Step() object
    // a step contains a beat location and a voice / note value
    ////////////////////////////////////////////////////////////
    function Step(locX, locY, width, height) {
        this.x = locX;
        this.y = locY;
        this.width = width;
        this.height = height; 
        this.on = false;

        this.move = function() {
        this.x += sketch.random(-this.speed, this.speed);
        this.y += sketch.random(-this.speed, this.speed);
            };

        this.checkMouse = function(){
            if ((sketch.mouseX > this.x && sketch.mouseX < (this.x+this.width)) && (sketch.mouseY > this.y && sketch.mouseY < (this.y+this.height)))
            {
                this.toggleState();
            }
        }

        this.toggleState = function(){
            this.on = !this.on;
        }

        this.setOn = function(){
            this.on = true;
        }
        this.setOff = function(){
            this.on = false;
        }

        this.display = function() {
            if(this.on){
                sketch.fill(0, 100, 200);
            }
            else{
                sketch.fill(0, 25, 50);
            }
            sketch.rect(this.x, this.y, this.width, this.height);
            }
    };
     

});
