/**
 * Todo: cut out unnecessary public and state variables as needed  (maybe add forceUpdate in places)
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TrainInterface} from './TrainInterface.jsx';
import {MouseRectangle} from './MouseRectangle.jsx';
import {DtwInterface} from './DtwInterface.jsx';



let colors = {
    0: 'blue',
    1: 'red',
    2: 'green',
    3: 'purple',
    4: 'powderblue',
    5: 'coral',
    6: 'brown',
    7: 'grey',
    8: 'cadetblue',
    9: 'yellow'


};

export class MlComponent extends Component {
    
    constructor(props) {
        super();
        this.state = {
            trainState: false, //states of Ml process
            recordState: false,
            runState: false,
            clearState:false,
            //trainingSet: [],
            //rapidInput: [], // inputs for training data
            //myOutput: [0],  // output given by user for training
            rapidOutput: null, //output given by algorithm
            numInputs: null,
            algorithm: null,
            //dataInput: this.props.ignoreRoomInput,  // does a data input from an external room exist? 
            //dataInput: false (default) corresponds to mouse input, true is room input
            //have to do this as we potentially have data coming in from 2 sources
            color: 'blue',
            boundaryState: false,
            boundaryDone: false,
            boundaryArray: []
        }
        this.setAlgorithm = this.setAlgorithm.bind(this);
        this.process = this.process.bind(this);
        //this.handleMouse = this.handleMouse.bind(this);
        //this.handleData = this.handleData.bind(this);
    }

    //
    rapidInput = []
    myOutput = [0]

    trainingSet = []

    classifiedPoints = []  //for boundary array for mouse rectangle
    

    tempSet = []
    maxTempTrainLength = 0
    maxTrainLengthby4 = 0
    dtwOutputList = []
    dtwTestSet = []
    lengthTestSet = 0

    static propTypes = {
        rooms: PropTypes.arrayOf(PropTypes.object),
        trainingSet: PropTypes.arrayOf(PropTypes.object)
    };


    rapidMix =  window.RapidLib();
    myAlgorithm = null;

    componentWillReceiveProps(newProps) {
        if (newProps.algorithm != this.state.algorithm) {
            console.log('new algorithm is ' + newProps.algorithm + ', old algorithm was ' + this.state.algorithm);
            this.setAlgorithm(newProps.algorithm);
        }       

        
        if (!this.props.ignoreRoomInput && newProps.remoteInput) {
            this.handleData(newProps.remoteInput);
        }
        
        
    }

    setAlgorithm(algorithm) {
        this.setState({
            algorithm: algorithm,
            trainState: false,
            runState: false,
        }, () => {
            console.log('made it here ... ' + this.state.algorithm);
            /** note that the state is set in setAlgorithm before it actually updates the state 
             so we need a callback so that the algorithm will be set immediately, otherwise myAlgorithm 
             is null and state will only be updated after the Component Updates
            */
            switch(this.state.algorithm) {
                case 'K-Nearest Neighbors':
                    this.myAlgorithm = new this.rapidMix.Classification();
                    console.log('KNN set');
                    break;
                case 'Neural Network':
                    this.myAlgorithm = new this.rapidMix.Regression();
                    console.log('Neural Net set');
                    break;
                case 'Dynamic Time Warping':
                    this.myAlgorithm = new this.rapidMix.SeriesClassification();
                    this.clearMe(); //training Data is handled differently for this algorithm so clear the trainingSet
                default:
                    break;
            }
        });
    }
    
    setMouse() {
        if (!this.props.ignoreRoomInput) {
            //clear input on change of input data type to prevent training set ml errors
            this.clearMe();
            console.log('recordstate: ', this.state.recordState)
            this.props.ignoreInput(true);
        }
    }

    setInput() {
        if (this.props.ignoreRoomInput) {
            this.props.ignoreInput(false);
            console.log('recordstate: ', this.state.recordState)
            this.clearMe();
        }
    }

    handleMouse(mouseData) {  //takes in [mouseX, mouseY] 
        this.rapidInput = mouseData;

        if (this.state.algorithm == 'Dynamic Time Warping') {
           console.log('attempting to to DTW with non-input(mouse) data, this is not supported yet');
            //this.handleDTW(inputData);
        }
        
        else {
            this.trainingSet = this.trainingSet.concat({
                input: this.rapidInput,
                output: this.myOutput,
            });
            console.log('Added input: ' + this.rapidInput + ' and output: ' + this.myOutput + ' to the training set!');
        }
    }
    
    handleInputData(inputData) {
        this.rapidInput = inputData;

        if (this.state.algorithm == 'Dynamic Time Warping') {
            console.log('dtw about to be called');
            this.handleDTW(inputData);
        }

        else {
            this.trainingSet = this.trainingSet.concat({
                input: this.rapidInput,
                output: this.myOutput,
            }), 
            console.log('added ' + this.rapidInput + ' and output: ' + this.myOutput + ' to the training set');
        }
    }

    checkInputLength(inputData) {
        //console.log('checking input length')
        //console.log(inputData)
        //console.log(inputData.length)
        //console.log(this.state.numInputs)
        if (inputData.length != this.state.numInputs) {
            this.setState({
                numInputs: inputData.length,
                clearState: true

            }, () => {
                this.trainingSet = []

                if (this.myAlgorithm) {this.myAlgorithm.reset()}
                if (this.state.numInputs == inputData.length) {
                    /* possible infinite alert loop here */
                    alert('length of inputs changed, algorithm training and training set was reset/cleared')
                    console.log('reset classifier to take inputs of length ', this.state.numInputs)
                }
            })
        }
    }

    handleDTW(inputData) {
        //this is coming to record
        this.tempSet.push({
            input: inputData
        });
        console.log('added ' + inputData + ' to the temp training set with output: ' + this.myOutput);
    }
    
    handleData(inputData) {
        if (!this.state.boundaryState) {
            this.checkInputLength(inputData);
        }

        if (this.state.recordState) {
           
            // if we are recording, then set the state and push to the training set
            if (this.state.ignoreRoomInput) {  //if using mouse data
                this.handleMouse(inputData);
            }
            else { //if (!this.state.ignoreRoomInput) { //if using input room data
                this.handleInputData(inputData);
            }
            
            this.setState({
                trainState: false,
                clearState: false
                //having just recorded data, our trainset is not cleared, nor is it trained
            });

        }
        else if (this.state.runState && this.state.trainState) {
            //console.log('trained and running');
            if (inputData.length != this.state.numInputs) {
                console.log('incorrect number of inputs coming in (' + inputData.length + '), should be ' + this.state.numInputs);
            }
            else {
                //console.log('about to call process with inputData = ' + inputData);
                this.process(inputData);
            }
        }
        else if (this.state.boundaryState && this.state.trainState) {
            this.boundaryProcess(inputData)
        }
        //else {console.log('only state sent');}
    }

    showTrainSet() {
        //console.log(this.state.trainingSet);
        console.log(this.trainingSet);
    }

    relayOutput(output) {
        if (this.state.algorithm == 'Dynamic Time Warping' && this.state.recordState) {
            alert('Cannot Change outputs while recording for Dynamic Time warping');
        }
        else {
            this.myOutput = [output]
            this.setState({
                color: colors[this.myOutput]
            },
                console.log('set my output to: ' + output + ', with color: ' + this.state.color)
            );
        }
    }

    relayInputLength(expectedInputLength) {
        this.setState({
            numInputs: expectedInputLength
        }, () => console.log('expected input length is ', this.state.numInputs));
    }

    trainMe() {
        if (this.state.algorithm) {
            console.log(this);
            console.log(this.trainingSet);
            console.log('length of training set is: ' + this.trainingSet.length)
            console.log(this.myAlgorithm);
            this.myAlgorithm ? console.log(this.myAlgorithm + ' exists') : console.log('alg doesnt exist!');
            this.trainingSet? console.log(this.trainingSet + ' exists') : console.log('alg doesnt exist!');
            console.log(this.myAlgorithm.train);
        
            this.myAlgorithm.train(this.trainingSet);
            console.log('got here');
            this.setState({
                trainState: true,
                recordState: false,
            }, () => console.log ('trainState is ' + this.state.trainState + ' recordState is ' + this.state.recordState));
            
        }
        else {
            alert('Need to select an algorithm to train the data on first!');
        }
    }

    clearMe() {
        this.trainingSet = []
        this.dtwOutputList = []
        //might have to clear other lengths, not sure yet
        this.setState({
            clearState:true
        });
    }



    boundaryProcess(inputData) {
        inputData.forEach(
            (input) => {
                let output = this.myAlgorithm.process(input)
                console.log('the color: ' + output + ' was added');
                this.classifiedPoints.push( [ input, colors[output] ] );
            }
        );
        this.setState({
            boundaryArray: this.classifiedPoints,

        }, () => this.setState({
               boundaryDone: true
            })
        );
        this.classifiedPoints = []
    }

    processDTW(input) {
        console.log('input going into dtwTestSet with value ' + input);
        this.dtwTestSet.push({
            input: input
        });
        this.lengthTestSet += 1;  // ends up being O(n) vs. calculating length each time -> O(n^2)
        //console.log('lengthTestSet is: ' + this.lengthTestSet + ', and maxTempTrainLength is: ' + this.maxTempTrainLength);
        if (this.lengthTestSet % 4 == 0 || this.lengthTestSet >= this.maxTempTrainLength) {
            //console.log('here');
            let slicePoint = this.lengthTestSet - this.maxTempTrainLength;
            // slice the TestSetLength to look at only time segments <= the longest training ex
            //console.log(this.dtwTestSet.slice(slicePoint, this.lengthTestSet));
            //console.log(this.myAlgorithm);
            let match = this.myAlgorithm.run(this.dtwTestSet.slice(slicePoint, this.lengthTestSet-1));
            //look at possible section of testset
            this.setState({
                rapidOutput: this.dtwOutputList[match],
            }, () => {
                console.log('classified dtw as ' + this.state.rapidOutput);
                this.props.handleClassification(this.state.rapidOutput);
            });

        }
        
        if (this.lengthTestSet >= this.maxTrainLengthby4 ) {  
            //if the length of the array is 4 * the max, cut at 3/4ths and recopy last 1/4th array elements so the array doesn't 
            //doesn't get too large since this is all happening in real time
            this.dtwTestSet = this.dtwTestSet.slice(this.maxTempTrainLength*3);
            this.lengthTestSet = this.maxTempTrainLength;
        }
        
    }

    process(input) {
        //console.log('got to process');
        if (this.state.algorithm == 'Dynamic Time Warping') {
            this.processDTW(input);
        }

        else {
            //console.log('process called')
            //console.log(input)
            // console.log('classify ' + input + ' as ' + this.myAlgorithm.process(input))
            this.setState(
                {
                    rapidOutput: this.myAlgorithm.process(input)
                },
                () => {
                    this.setState({
                        color: colors[this.state.rapidOutput]
                    }, () => {
                            // console.log('set rapidOutput to: ' + this.state.rapidOutput + ', with color: ' + this.state.color);
                            this.props.handleClassification(this.state.rapidOutput);
                        }
                    );  
                }
            );
        }
    }

    togRecord() {
        if (this.state.runState) {
            alert('Cannot Record While Running!');
        }
        else {
            this.setState({
                recordState: !this.state.recordState,
            },
            () => {
                if (this.state.algorithm == 'Dynamic Time Warping' && !this.state.recordState) {
                    //if DTW and recording, push training example after recording toggled off
                    //this is pushing all the possible example labels
                    this.dtwOutputList.push(this.myOutput);

                    if (this.tempSet.length > this.maxTempTrainLength) {
                        // set max Training length for use in when to recreate array so doesn't get too big
                        this.maxTempTrainLength = this.tempSet.length
                        this.maxTrainLengthby4 = this.maxDtwTrainLength * 4
                    }

                    this.trainingSet.push(this.tempSet);
                    /* This could possibly be the error??
                    this.trainingSet.push({
                        input: this.tempSet,
                        output: 0,
                    });
                    */
                    console.log('pushed trainingSet to dtwTotal Array with Output = ' + this.myOutput);
                    console.log(this.trainingSet);
                    this.tempSet = []
                    
                }
                console.log('recording ' + this.state.recordState)
            });
        }
    }

    togRun() {
        if (this.state.recordState) {
            alert('Cannot run while recording!');
        }
        else {
            this.setState({
                runState: !this.state.runState
            });
        }
    }

    boundaryToggle(statePassed) {
        this.setState({
            boundaryState: statePassed 
        }, () => {
            if (!statePassed) {
                this.classifiedPoints = []
                this.setState({
                    boundaryDone: false
                });
            }
        }
        );
    }
    
    render() {
        let guiPos = {
                position: 'relative',
                top: 10,
                height: 500,
                left: 10,
                zIndex: 0
        }

        return (
            <div style={guiPos}>
               <div style={{
                   position: 'relative',
                   display: 'flex',
                   margin:'auto',
                   }}>
                    <TrainInterface
                        rapidOutput={this.state.rapidOutput}
                        numInputs={this.state.numInputs}
                        dataInput={this.props.ignoreRoomInput}
                        setMouse={this.setMouse.bind(this)}
                        setInput={this.setInput.bind(this)}
                        trainState={this.state.trainState}
                        recordState={this.state.recordState}
                        runState={this.state.runState}
                        clearState={this.state.clearState}
                        trainMe={this.trainMe.bind(this)}
                        clearMe={this.clearMe.bind(this)}
                        togRecord={this.togRecord.bind(this)}
                        togRun={this.togRun.bind(this)}
                        relayOutput={this.relayOutput.bind(this)}
                        showTrainSet={this.showTrainSet.bind(this)}
                        boundaryToggle={this.boundaryToggle.bind(this)}
                        relayInputLength={this.relayInputLength.bind(this)}
                    >

                    </TrainInterface>
                    <MouseRectangle 
                        handleData={this.handleData.bind(this)}
                        color={this.state.color}
                        recordState={this.state.recordState}
                        runState={this.state.runState}
                        clearState={this.state.clearState}
                        boundaryState={this.state.boundaryState}
                        boundaryDone={this.state.boundaryDone}
                        boundaryProcess={this.boundaryProcess.bind(this)}
                        classifiedPoints={this.state.boundaryArray}
                    />
                </div>
            </div>
        );
    }
}