import {Indata} from "./connection"

export class Data implements Indata{  //rename this to Data
    name:string;
    type:string;
    data:any;
    constructor(indata?:Indata, name?:string){
        this.data = indata.data;
        this.name = name;
    }
}