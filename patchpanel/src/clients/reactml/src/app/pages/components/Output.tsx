import * as React from 'react';
//may need to switch this to import React, {Component} from 'react' if get errors later due to depreciation warning
import {DropDown} from './Dropdown';

interface Props{
    handleSelection: (selection:string, type:string) => void;
    dropDownType?: string;
    orientation?: string;
}

//may not need this class, just using it for styling and labelling currently
export default class Output extends React.Component < Props, {}  >{
    constructor(props) {
        super();
    }

    render() {
        let outputStyle:any = [{  //in react-typescript style like this!! {[]}
            height: 350,
        }]
        
        //console.log('output sees this.props.handleSelection as ', this.props.handleSelection)
        //console.log(this.props);
        return (

            <div style={outputStyle}>
                <DropDown 
                    handleSelection={this.props.handleSelection}
                    dropDownType={'output connection type'}

                />
            </div>
        );
    }

}