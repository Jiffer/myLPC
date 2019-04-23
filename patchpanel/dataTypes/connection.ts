
import {Pixel, Image, IPixel} from "./bitmap";
import {Midi} from "./midi"
import {Data} from "./data"
//import {Accelerometer, IAccelerometer} from "./accel"


export interface Indata {
    name: string;
    type: string;
    data: any;
}



class Connection { //maybe rename this dataObject or something
    //connection will be web rtc something

    //more to come here
    //a bit confused on how to set this up, different
    //methods will return different outputs, so this could
    //possibly work better as a function?
}

/*  Old Input interface
export interface Input {
    data: any //number[] | string | AccelMBit;
    //maybe add a device type for microbit??
    //mime type field and human readable field
}
*/

/*
interface Window {
    Connection(): Connection;
    input: Input;
}
*/
/*
*** old typechecker ***
export function createDataObject(data:Input, type?:string): Image | Midi | Data | Accel {
    //typechecking and conversion all done in the constructors
    if (type === "image") {
        let input:Image = new Image(data, type)
        return input;
    }
    else if (type === "midi") {
        let input:Midi = new Midi(data, type);
        return input;
    }
    //add in MicroBit Type Check
    else if (type == "accel" && data.data typeof AccelMBit) {
        let input:Accel = new Accel(data, type)
        return input
    }
    //else if (type == "custom") {
    //    
    //}
    else {
        console.log("the data type was not entered, or that type is not currently supported")
        let input:Data = new Data(data)
        return input;
    }
}
*/