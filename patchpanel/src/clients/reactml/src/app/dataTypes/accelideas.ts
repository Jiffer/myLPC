import {Indata} from "./connection"
import {Data} from "./data"


export interface IAccelerometer {
    //retain name, rework data
        x: number;
        y: number;
        z: number;
        s: number;
}

export class Accelerometer extends Data {
    name: string = "Acceleration";
    type: string = "accelerometer";
    data: IAccelerometer[];

    constructor(indata?:IAccelerometer, name?:string){ // data:{xIn:number, yIn:number, zIn:number, s:number}
        super();
        this.name = name;
        if (indata) {
            this.data.push(indata)
        }
    }

    addData = function(indata:IAccelerometer): void{
        this.data.push(indata)
    }

    scaleData = function(scalar = 2048):IAccelerometer[] {    //default 2048, should it be unchangable?
        let scaled_array:IAccelerometer[] = []
        this.data.forEach(
            (accel:IAccelerometer) => {
                let scaled:IAccelerometer = {
                    'x': accel.x/scalar,
                    'y': accel.y/scalar,
                    'z': accel.z/scalar,
                    's': accel.s/scalar
                }
                scaled_array.push(scaled)
            }
        )
        return scaled_array
    }
}

// *** old typeguard, but only works at runtime ***
//let isMBit = (acceldata): acceldata is AccelMBit => (<AccelMBit>acceldata).s !== undefined
//improved typeguard for user-defined classes

