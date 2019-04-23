import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Rooms } from '../api/rooms.js';

import Select from 'react-select'
import 'react-select/dist/react-select.css';




let pix_rooms = [
    {value: 'pix1', label:'pix1 option'},
    {value: 'pix2', label:'pix2 option'},
];
let img_rooms= [
    {value: 'img1', label:'img1 option'},
    {value: 'img2', label:'img2 option'},
];
let midi_rooms = [
    {value: 'midi1', label:'midi1 option'},
    {value: 'midi2', label:'midi2 option'},
];
let mbit_rooms = [
    {value: 'mbit1', label:'mbit1 option'},
    {value: 'mbit2', label:'mbit2 option'},
    {value: 'mbit3', label:'mbit3 option'},
];
let custom_rooms = [
    {value: 'jd', label: 'jds room'},
    {value: 'jiffer', label:'jiffer synth'}
]
let dataTypes = [
    { value: '1', label: 'Pixel', rooms: pix_rooms, title:'Pixel Rooms'},
    { value: '2', label: 'Image', rooms: img_rooms, title:'Image Rooms'},
    { value: '3', label: 'Midi', rooms: midi_rooms, title:'Midi Rooms'},
    { value: '4', label: 'Microbit', rooms: mbit_rooms, title:'Microbit Rooms'},
    { value: '5', label: 'Custom', rooms: custom_rooms, title:'Custom Rooms'}
];

let class_algorithms = [
    {value: 'logreg', label: 'Classification'},
]
let regr_algoithms = [
    {value: 'reg', label: 'Regression'}
]
let desired_output = [
    {value: 'discrete', label: 'classifier', rooms: class_algorithms, title:'Classification Algorithms'},
    {value: 'continuous', label: 'regressor', rooms: regr_algoithms, title:'Continous Output Algorithms (Regression)'},
]

export class TopDrop extends Component {
    constructor(props){
        super(props)
        this.state = {
            disabled: false,
            searchable: this.props.searchable,
            selectValue: 'room 1',
            clearable: true,
        };
        this.defaultProps = this.defaultProps.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateRoomOption = this.updateRoomOption.bind(this);
        this.typeDropDown = this.typeDropDown.bind(this);
    }
    static propTypes =  {
        label: PropTypes.string,
        searchable: PropTypes.bool,
    }
    defaultProps () {
        return {
            searchable: true,
            };
    }
    typeDropDown (dropDownType) {
        if (dropDownType == 'ml') return desired_output
        else return dataTypes
    }
    updateValue (newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log('Options for ' + newValue.label + ' are ' + newValue.rooms)
		this.setState({
			selectValue: newValue,   //automatically gets the label
		});
        this.relayParentUpdate(newValue.rooms, newValue.title);

	}
    updateRoomOption(newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log(newValue)
		this.setState({
			selectValue: newValue, 
		});
	}
    relayParentUpdate (rooms, title) {
        console.log('update triggered and value passed is: ' + rooms + ' & ' + title)
        this.props.onUpdate(rooms, title) 
    }
    render() {
        let selectStyle = {
            width: "10%",
        }
        return (
            <div className="topdrop" label='mytop'  style={selectStyle}>
                <h3> {this.props.dropDownType } </h3>
                <Select ref="myType" id="roomselect"
                    autofocus 
                    options={this.typeDropDown(this.props.dropDownType)} 
                    clearable={this.state.clearable} 
                    name="selected-state" 
                    value={this.state.selectValue}
                    placeholder="type data type"
                    onChange={this.updateValue}
                    searchable={this.state.searchable} 
                />
            </div>
        );
}}

export class BotDrop extends Component {
    constructor(props){
        super(props)
        this.state = {
            disabled: false,
            searchable: this.props.searchable,
            selectValue: 'room 1',
            clearable: true,
        };
        this.defaultProps = this.defaultProps.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateRoomOption = this.updateRoomOption.bind(this);
        this.typeDropDown = this.typeDropDown.bind(this);
    }
    static propTypes =  {
        label: PropTypes.string,
        searchable: PropTypes.bool,
        title: PropTypes.string,
    }
    defaultProps () {
        return {
            label: 'mydrop:',
            searchable: true,
            title: null,
            };
    }
    typeDropDown (dropDownType) {
        if (dropDownType == 'ml') return desired_output
        else return dataTypes
    }
    updateValue (newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log('Options for ' + newValue.label + ' are ' + newValue.rooms)
        this.setState({
            selectValue: newValue,   
            //automatically gets the label, not sure how this happens
        });
	}
    updateRoomOption(newValue) {
		console.log('Room changed to ' + newValue.label);
        console.log('newvalue is ' + newValue);
		this.setState({
			selectValue: newValue, 
		});
	}

    render() {
        let selectStyle = {
            width: "10%",
        }
        return (
            <div className='botdrop' style={selectStyle}> 

                <h3> {this.props.title} </h3> 
                {console.log('type of dropdown is ' + this.props.dropDownType)}
                {console.log('dropobject ' + this.typeDropDown(this.props.dropDownType))}
                {console.log('title = ' + this.typeDropDown(this.props.dropDownType).title)}
                <Select ref="inputBar"
                    autofocus 
                    options={this.props.rooms}
                    clearable={this.state.clearable} 
                    name="selected-state" 
                    value={this.state.selectValue}
                    placeholder="type room option"
                    onChange={this.updateRoomOption}
                    searchable={this.state.searchable} 
                />
            </div>
        );
}}

export class DropDown extends Component {
    constructor (props) {
        super(props)
        this.state = {
          rooms: [
              {value: 'this', label: 'works'}
          ],
          title: null,
        }
    }
    static propTypes = {
       dropDownType: PropTypes.string,
    }
    onUpdate (rooms, title) {
        this.setState({ 
            rooms: rooms,
            title: title,
         })
    }
    render () {
        if (this.props.dropDownType == 'ml') {
           return (
                <div className='dropdown'> 
                    <TopDrop dropDownType='ml' onUpdate={this.onUpdate.bind(this)}/>
                    <BotDrop rooms={this.state.rooms} title={this.state.title}/>
                </div>
            ); 
        }
        //else if (this.props.dropDowntype == 'rooms')
        else {
            return (
                <div className='dropdown'> 
                    <TopDrop dropDownType ='room type' onUpdate={this.onUpdate.bind(this)}/>
                    <BotDrop rooms={this.state.rooms} title={this.state.title}/>
                </div>
            );
        }
}}
/*
ReactDOM.render(
    <App />,
    document.getElementById('render-target')
);
*/


/* 
<div style={{ marginTop: 14 }}>


*** can toggle searchable, disabled, and clearable properties if wanted

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