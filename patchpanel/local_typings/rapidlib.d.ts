// Typings for RapidLib

interface Window {
    RapidLib(): RapidLib;
}

interface trainSet {
    input: number[];
    output: number;
}

/* ------------------
TypeScript definitions for RapidMix Machine Learning library
http://gitlab.doc.gold.ac.uk/rapid-mix/RapidLib
-------------------- */
// extend window interface for RapidLib

// RapidLib object
declare class RapidLib{
    Regression: typeof Regression;
    Classification: typeof Classification;
    ModelSet: typeof ModelSet;
}

// members of RapidLib
declare class Classification{
    train(trainingSet: object []): boolean;
    initialize() : boolean;
    process(input: number []): number [];
}

declare class Regression{
    train(trainingSet: trainSet[]): boolean;
    initialize(): boolean;
    process(input: number []): number[];
}

declare class ModelSet{
    train(trainingSet: object []): boolean;
    initialize(): boolean;
    loadJSON(url:string): boolean;
    process(input: number[]): number[];
    //Implement Later - functions currently undefined for ts
    //addNNModel(trainingSet:trainSet[]): boolean
    //addKNNModel(trainingSet:trainSet[]): boolean
}

