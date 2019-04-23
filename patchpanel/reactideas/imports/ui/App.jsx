
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { Rooms } from '../api/rooms.js';

import { DropDown } from './Dropdowns.jsx'


export class App extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div>
                <DropDown dropDownType='room type'/>
                <DropDown dropDownType='ml' />
            </div>
        );
    }
}