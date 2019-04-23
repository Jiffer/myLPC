import {getDataConnection, DataConnection} from '../client'

import {IMidi, Midi} from '../../../dataTypes/midi'

import p5 =   require("p5")
p5.dom =   require("p5/lib/addons/p5.dom")
p5.sound = require("p5/lib/addons/p5.sound")


// globals
let voice: typeof p5.Oscillator[] = []
let fft: typeof p5.FFT;
let filter: typeof p5.LowPass;
var ffreq, fres; // filter cutoff and resonance
let masterGain: typeof p5.Gain;

let amp = .5;
let volume = 1;
let polyphony = 12; // how many notes at once?
let noteTriggered:boolean[] = [];

// input data from other rooms
let filterCutoff = 1000; // Hz
let filterQ = 2;

// connection object vars
let connection:DataConnection = null;  

//function setupDataConnectionStuff() {
let setupDataConnectionStuff = function(){
  // Elements
  // input room stuff
  let inputRoomForm = <HTMLFormElement> document.getElementById('input-room-form')
  let inputRoomBox = <HTMLInputElement> document.getElementById('input-room-box')
  let inputRoomSubmitButton = <HTMLInputElement> document.getElementById('input-room-button') 
   
  // sliders stuff
  let sliderForm = <HTMLFormElement> document.getElementById('slider-form')
  let volumeSlider = <HTMLInputElement> document.getElementById('volume')
  let filterCutoffSlider = <HTMLInputElement> document.getElementById('frequency')
  let filterQSlider = <HTMLInputElement> document.getElementById('q') 

  // Receive messages from other rooms
  // input1, input2, slider1, slider2
  let handleDataReceived = (key:string, value:any)=> {
    if (key == "midi"){
        if(value.note == -1){
            // use default freq
        }
        else{
            if(value.index != null){
                voice[value.index].osc.freq(getFrequency(value.note)); // convert midi note to freq
                
            }
            else{
                console.log("playing note: " + getFrequency(value.note));
                voice[0].osc.freq(getFrequency(value.note));
                noteTriggered[0] = true;
            }
        }
        
        amp = value.velocity / 127;
        noteTriggered[value.index] = true;
        //console.log("set amplitude: " + amp + " triggered note: " + value.note);
    }
    else if(key == "filterCutOff"){
        filterCutoffSlider.value = value; // to set the current slider
        updateFilterCutOff(parseFloat(value))
    }
    else if(key == "filterQ"){
        filterQSlider.value = value;
    }else{
        console.log("received unknown data key: " + key )
    }
  }

  inputRoomForm.addEventListener('submit', function (e:Event) {
    e.preventDefault()
    console.log("joining room " + inputRoomBox.value)
    connection = getDataConnection(inputRoomBox.value)
    inputRoomBox.name = inputRoomBox.value
    inputRoomBox.disabled = true
    inputRoomSubmitButton.disabled = true

    connection.onDataReceived((key:string, value:any)=>{
        handleDataReceived(key, value)
    })
  })

  // send the data out when slider is touched
  volumeSlider.addEventListener('input', function (e:Event) {
      volume = parseFloat(volumeSlider.value);
      masterGain.amp(volume, .1, 0); // set volume of masterGain object, in .1 seconds, now 
  })

  filterCutoffSlider.addEventListener('input', function (e:Event) {
      updateFilterCutOff(parseFloat(filterCutoffSlider.value))
  })

  filterQSlider.addEventListener('input', function (e:Event) {
      updateFilterQ(parseFloat(filterQSlider.value));
      
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

        // sound stuff
        // fft used for plotting the audio waveform
        fft = new p5.FFT();   
        filter = new p5.LowPass();
        filter.set(2000, 5);
        filter.disconnect();

        // volume
        masterGain = new p5.Gain();
        masterGain.connect();
        masterGain.setInput(filter);
        
        // synth voices
        for (var i = 0; i < polyphony; i++){
            var newOsc = new makeVoice(100 + i * 100);// p5.TriOsc(); // set frequency and type
            voice.push(newOsc);
            voice[i].osc.start();
            voice[i].osc.disconnect();
            voice[i].osc.connect(filter);
            noteTriggered.push(false);
        }
    }
    //////////////////////////////////////////
    // p5 sketch draw()
    //////////////////////////////////////////  
    sketch.draw = () => {
        sketch.background(100);
        // filter.set(sketch.mouseX*10, 5); // uncomment to use mousex position instead of slider

        // check if a new note should trigger
        for( var i = 0; i < polyphony; i++){
            if(noteTriggered[i] == true){
                voice[i].playEnv();
                noteTriggered[i] = false;
            }
        }
        
        let waveform:number[] = fft.waveform();  // analyze the waveform
        sketch.beginShape();
        sketch.strokeWeight(5);
        for (var i = 0; i < waveform.length; i++){
            let x:number = sketch.map(i, 0, waveform.length, 0, sketch.width);
            let y:number = sketch.map(waveform[i], -1, 1, sketch.height, 0);
            sketch.vertex(x, y);
        }
        sketch.endShape();

        
        // Display slider data
        sketch.fill(0);
        sketch.text("volume: " + volume, 10, 10);
        sketch.text("filter cutoff: " + filterCutoff, 10, 20);
        sketch.text("filter Q: " + filterQ, 10, 30);

    }
    // trigger a note when mouse is released
    sketch.mouseReleased = () => {
        var randomVoice = parseInt(sketch.random(12));
        //osc[randomVoice].playEnv();
        noteTriggered[randomVoice] = true;
    }        
});

///////////////////
// Synth voice
///////////////////
//function makeVoice(freq:number) {
let makeVoice = function(freq:number){
 
  this.osc = new p5.Oscillator();
  this.osc.setType('triangle');  
  this.osc.freq(freq);
  
 // create an envelope to structure each note
  this.attackLevel = 0.8;
  this.releaseLevel = 0;
  this.attackTime = 0.001; // 
  this.decayTime = 0.3;
  this.susPercent = 0; // no sustain
  this.releaseTime = 1.0;
  this.env = new p5.Env();
  this.env.setExp(true);
  this.env.setADSR(this.attackTime, this.decayTime, this.susPercent, this.releaseTime);
  this.env.setRange(this.attackLevel, this.releaseLevel);
  
  this.osc.amp(this.env);
  this.osc.start();
  
   
  this.playEnv = function() {
    //this.env.play();
    this.env.triggerAttack();
  }
  this.releaseEnv = function() {
    //this.env.play();
    this.env.triggerRelease();
  }
}

////////////////////////////////////////////////////////////////////////////////////
// getFrequency()
// converts a MIDI note number to Frequency
// inspired by:
// https://sigusrone.com/articles/building-a-synth-with-the-web-audio-api-part-two 
////////////////////////////////////////////////////////////////////////////////////
//function getFrequency(midi_code) {
let getFrequency = function(midi_code:number):number {
  let offset_code = midi_code - 69;
  if (offset_code > 0) {
    //return Number(440 * Math.pow(2, offset_code / 12));
    return (440 * Math.pow(2, offset_code / 12)) as number;
  } else {
    //return Number(440 / Math.pow(2, -offset_code / 12));
    return (440 / Math.pow(2, -offset_code / 12)) as number;
  }
}

// assume values come in between 0:1
//function updateFilterCutOff(freq: number){
let updateFilterCutOff = function(freq:number) {
    filterCutoff = 2000 * freq ;
    filter.freq(filterCutoff);
}

// assume values come in between 0:1
//function updateFilterQ(q: number){
let updateFilterQ = function(q:number){
    filterQ = 20 * q;
    filter.res(filterQ);
}