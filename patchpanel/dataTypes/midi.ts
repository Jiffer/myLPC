import {Indata} from "./connection"
import {Data} from "./data"

class MimeDeclaration {
    mimeType:MimeType;
    humanReadableType:string;

    constructor(humanReadableType:string) {  //mimeType:MimeType, 
        //this.mimeType = mimeType;
        this.humanReadableType = humanReadableType;
    }
}

export interface IMidi extends Indata {
    data: number[]
}


export class JifferSeqMidi {
    name: string;
    type: string = "midi";
    data: {
        index: number;
        note: number;
        velocity: number;
    } = {   //initialize values
        'index': 0,
        'note':-1,
        'velocity':100
    }

        constructor(index?:number, note?:number, velocity?:number){
            if (index) this.data.index = index
            if (note) this.data.note = note
            if (velocity) this.data.velocity = velocity
        }
}

let mymidi = new JifferSeqMidi(5, -1, 127)

console.log(mymidi)

export class JifferPolyMidi {
    name: string;
    type: string = "midi";
    data: {
        
    }
    constructor(){

    }
}

export class Midi extends Data implements IMidi { //MidiNote/message // implements Data {

    name =  "Midi"
    type = "midi"
    static mime:MimeDeclaration = new MimeDeclaration("audio");
    mdata:Uint8Array;
    command:number; 
    mtype:number; 
    note:number;
    velocity:number;
    index: number;

    constructor(indata:IMidi, index:number, name?:string) {
        super(indata); //basic data class only takes type data

        this.name = name;
        let udata = new Uint8Array(indata.data);
            //convert data to Uint8
            this.mdata = udata || null;
            this.command = this.mdata[0] & 0xf || null;
            this.mtype = this.mdata[0] & 0xf0 || null;
            this.note = this.mdata[1] || null;
            this.velocity = this.mdata[2] || null;
    }
}

/* Future Thoughts

// *** Where does receivedTime come in with midi messages ? ***

// *** Mimetype Ideas ***
//let theMime:MimeType = new MimeType;
//theMime.description = "audio/midi"
//audio/midi = new MimeType;
//static theMime = new MimeType

//noteOn method?
//noteToFreq method?
//noteOff method?
//integrate with p5 methods?

//constructor ideas
//constructor(midiMessage?:{receivedTime:number, data:Uint8Array}) {  //incorporate receivedTime??
//constructor();
//constructor(message?:Input) { //: MIDIMessageEvent){

*/