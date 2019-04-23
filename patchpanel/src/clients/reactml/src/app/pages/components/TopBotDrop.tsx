
import * as React from 'react';
//may need to switch this to import React, {Component} from 'react' if get errors later due to depreciation warning
import {render} from 'react-dom';
//import Select from 'react-select';
import Select = require('react-select');  // need to import this way b/c of React.createElement render error
import {Option} from 'react-select';
import 'react-select/dist/react-select.css';


/** All of these arrays will be in the db eventually */

interface myOption extends Option{
    rooms?: Option[],
    title?: string,
}


let pix_rooms:myOption[] = [
    {value: 'pix1', label:'Emily Pixel'},
    {value: 'pix2', label:'Melissa Pixel'},
];
let img_rooms:myOption[] = [
    {value: 'img1', label:'Carrie Image'},
    {value: 'img2', label:'Sahana Image'},
];
let midi_rooms:myOption[] = [
    {value: 'midi1', label:'Jiffer Midi'},
    {value: 'midi2', label:'Ben Midi'},
];
let mbit_rooms:myOption[] = [
    {value: 'mbit1', label:'Lila Mbit'},
    {value: 'mbit2', label:'Susie Mbit'},
    {value: 'mbit3', label:'Annie MBit'},
];
let custom_rooms:myOption[] = [
    {value: 'jd', label: 'Surprise!'},
    {value: 'jiffer', label:'Jiffers synth!'}
];
let dataTypes:[{value:string, label:string, rooms:myOption[], title:string}] = [
    { value: '1', label: 'Pixel', rooms: pix_rooms, title:'Pixel Connections'},
    { value: '2', label: 'Image', rooms: img_rooms, title:'Image Connections'},
    { value: '3', label: 'Midi', rooms: midi_rooms, title:'Midi Connections'},
    { value: '4', label: 'Microbit', rooms: mbit_rooms, title:'Microbit Connections'},
    { value: '5', label: 'Custom', rooms: custom_rooms, title:'Custom Connections'}
];

let class_algorithms:myOption[] = [
    {value: 'knn', label: 'K-Nearest Neighbors'}
]
let regr_algoithms:myOption[] = [
    {value: 'reg', label: 'Neural Network'}
]

let temporal_algorithms:myOption[] = [
    {value: 'temp', label: 'Dynamic Time Warping'}
]

let desired_output:[{value:string, label:string, rooms:myOption[], title:string}] = [
    {value: 'discrete', label: 'classifier', rooms: class_algorithms, title:'Classification Algorithms'},
    {value: 'continuous', label: 'regressor', rooms: regr_algoithms, title:'Continous Output Algorithms (Regression)'},
    {value: 'temporal', label: 'temporal classifier', rooms: temporal_algorithms, title:'Temporal Classification Algorithms'},
]

/** The top drop down menu of each dropdown -> selections affect the bottom dropdown  */

interface TopProps {
    handleRoomsTitleChange(rooms:myOption[], title:string): void,
    dropDownType: string,
    orientation?: string,
}

interface TopState {
    disabled: boolean,
    selectValue: string,
}

export class TopDrop extends React.Component <TopProps, TopState>{
    constructor(props){
        super()
        this.state = {
            disabled: false,
            selectValue: 'room 1',
        };
        this.updateValue = this.updateValue.bind(this);
        this.updateRoomOption = this.updateRoomOption.bind(this);
        this.typeDropDown = this.typeDropDown.bind(this);
    }

    /* this will eventually be the database query function */
    typeDropDown (dropDownType) {
        if (dropDownType == 'ml') return desired_output
        else return dataTypes  //also need to differentiate here for input and output room dict array
    }
    updateValue (newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log('Options for ' + newValue.label + ' are ' + newValue.rooms)
		this.setState({
			selectValue: newValue,   //automatically gets the label
		});
        console.log('update triggered and value passed is: ' + newValue.rooms + ' & ' + newValue.title)
        this.props.handleRoomsTitleChange(newValue.rooms, newValue.title);

	}
    updateRoomOption(newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log(newValue)
		this.setState({
			selectValue: newValue, 
        });

	}

    render() {
        let selectStyle = {
            width: "7%",
            minWidth: 300,
        }
        if (this.props.orientation == 'microbit') {
            selectStyle = {
                width: "7%",
                minWidth:150,
            }
        }
        return (
            <div className="topdrop"  style={selectStyle}>
                <h4> {this.props.dropDownType } </h4>
                <Select ref="myType" 
                    autofocus 
                    options={this.typeDropDown(this.props.dropDownType)} 
                    clearable={true}
                    name="selected-array"
                    value={this.state.selectValue}
                    placeholder="type of data"
                    onChange={this.updateValue}
                    searchable={true} 
                    disabled={this.state.disabled}
                />
            </div>
        );
}}

/** The bottom dropdown of each dropdown component */
interface BotProps {
    handleSelection: (selection:string, type:string) => void,
    rooms: Option[],
    title: string,
    dropDownType: string,
    showbot: string,
    orientation?: string,
}

interface BotState {
    disabled: boolean,
    selectValue: string,
}

export class BotDrop extends React.Component <BotProps, BotState> {
    constructor(props){
        super();
        this.state = {
            disabled: false,
            selectValue: 'room 1',
        };
        this.updateRoomSelection = this.updateRoomSelection.bind(this);
    }

    updateRoomSelection(newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log('newvalue is ' + newValue);
		this.setState({
			selectValue: newValue, 
        });
        // can relay the "room/algorithm" selection to the page based on the dropdown type
        
        this.props.handleSelection(newValue.label, this.props.dropDownType);
    }
    
    render() {
        let selectStyle:any = {
            width: "7%",
            minWidth: 300,
            visibility: this.props.showbot,
        }
        if (this.props.orientation == 'microbit') {
            selectStyle = {
                width: '7%',
                minWidth: 200,
                visibility: this.props.showbot,
            }
        }
        //console.log(this.props.showbot);
        return (
            <div className='botdrop' style={selectStyle}> 

                <h4> {this.props.title /*inherited from update change */} </h4> 
                <Select ref="inputBar"
                    autofocus 
                    options={this.props.rooms /* inherited from update change */}
                    clearable={true} 
                    name={"selected-array-value"}
                    value={this.state.selectValue}
                    placeholder="Connection Options"
                    onChange={this.updateRoomSelection}
                    searchable={true} 
                    disabled={this.state.disabled}
                />
            </div>
        );
}}

/**** can toggle searchable, disabled, and clearable properties if wanted

<label className="checkbox" style={{ marginLeft: 10 }}>
<input type="checkbox" className="checkbox-control" name="searchable" checked={this.state.searchable} onChange={this.toggleCheckbox}/>
<span className="checkbox-label">Searchable</span>
</label>
<label className="checkbox" style={{ marginLeft: 10 }}>
<input type="checkbox" className="checkbox-control" name="disabled" checked={this.state.disabled} onChange={this.toggleCheckbox}/>
<span className="checkbox-label">Disabled</span>
</label>
<label className="checkbox" style={{ marginLeft: 10 }}>
<input type="checkbox" className="checkbox-control" name="clearable" checked={this.state.clearable} onChange={this.toggleCheckbox}/>
<span className="checkbox-label">Clearable</span>
</label>
*/