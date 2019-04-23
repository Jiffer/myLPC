import * as dataTypes from "./connection"



export interface uGenInterface{
    inputs: dataTypes.Indata[]
    outputs: dataTypes.Indata[]
}

class uGen implements uGenInterface {
    inputs: dataTypes.Indata[]
    outputs: dataTypes.Indata[]

    

    getInputs(): dataTypes.Indata[]{
        return this.inputs;
    }

    getInputsSize(): number{
        return this.inputs.length;
    }

    getOutputs(): dataTypes.Indata[]{
        return this.outputs;
    }

    getOutputsSize(): number{
        return this.outputs.length;
    }
}