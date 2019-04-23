
import * as React from 'react';

import Select = require('react-select');
import {Option} from 'react-select';
import 'react-select/dist/react-select.css';

/*
interface myOption extends Option {
    display?:string
}
*/

let pix_rooms:Option[] = [
    //{value: 'null option', label: ''},
    {value: 'pix1', label:'Emily Pixel'},
    {value: 'pix2', label:'Melissa Pixel'},
];

let img_rooms:Option[] = [
    //{value: 'null option', label: ''},
    {value: 'img1', label:'Carrie Image'},
    {value: 'img2', label:'Sahana Image'},
];
let midi_rooms:Option[] = [
    //{value: 'null option', label: ''},
    {value: 'midi1', label:'Jiffer Midi'},
    {value: 'midi2', label:'Ben Midi'},
];
let mbit_rooms:Option[] = [
    //{value: 'null option', label: ''},
    {value: 'mbit1', label:'Lila Mbit'},
    {value: 'mbit2', label:'Susie Mbit'},
    {value: 'mbit3', label:'Annie MBit'},
];
let custom_rooms:Option[] = [
    //{value: 'null option', label: ''},
    {value: 'jd', label: 'Surprise!'},
    {value: 'jiffer', label:'Jiffers synth!'}
];


interface Props {
    handleSelection: (selection:string, type?:string) => void,

    orientation?: string,
}

interface State {
    disabled: boolean,
    selectValue: Option | string,
    //connections: Option[],
}

export default class PreTypedOutput extends React.Component <Props, State>{
    constructor(props) {
        super();
        this.state = {
            disabled: false,
            selectValue: 'room 1',
        }

        this.updateRoomSelection.bind(this);
        this.availableSelections = this.availableSelections.bind(this);
    }

    updateRoomSelection = (newValue:Option):void => {
		//console.log('Room changed to ' + newValue.label);
        //console.log('newvalue is ' + newValue);
		this.setState({
			selectValue: newValue, 
        });
        // can relay the "room/algorithm" selection to the page based on the dropdown type

        //console.log(newValue.label);
        if (newValue) {
            this.props.handleSelection(newValue.label, 'output')
        }
        else this.props.handleSelection('', 'output');


    }

    availableSelections = (orientation):Option[] => {
        switch(this.props.orientation) {
            case('microbit'):
                return mbit_rooms

            default:
                return img_rooms
        }
    }

    render() {
        let selectStyle:any = {
            minWidth: 200,
        }
        
        let title = 'Send To...'
        /*
        switch (this.props.orientation) {
            case('microbit'):

        }
        */
        //console.log('this.props.orientation is ',  this.props.orientation)
        //console.log(this.availableSelections(this.props.orientation))
        return (
            <div className='botdrop' style={selectStyle}> 


                <Select ref="inputBar"
                    autofocus 
                    options={this.availableSelections(this.props.orientation) /* inherited from update change */}
                    clearable={true} 
                    name={"selected-array-value"}
                    value={this.state.selectValue}
                    placeholder="Select Connection"
                    onChange={this.updateRoomSelection}
                    searchable={true} 
                    disabled={this.state.disabled}
                />
            </div>
        );
    }

}