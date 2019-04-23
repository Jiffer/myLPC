interface aData{
    x: number
    y: number
    z: number
    s: number
}

export class accelerometerData {
    type: string = "accelerometer";
    name: string;
    data: aData;

    constructor(name?: string){ // data:{xIn:number, yIn:number, zIn:number, s:number}
        this.name = name;
        this.data = {
            x: 0,
            y: 0,
            z: 0,
            s: 0,
        }
        
    }
}