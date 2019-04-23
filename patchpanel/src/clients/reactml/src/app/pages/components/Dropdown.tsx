import * as React from 'react';
//may need to switch this to import React, {Component} from 'react' if get errors later due to depreciation warning
import PropTypes from 'prop-types';
import {render} from 'react-dom';

import {TopDrop, BotDrop} from './TopBotDrop';

interface Props {
    handleSelection: (selection:string, type:string) => void,
    dropDownType?: string,
    orientation?: string,
}

interface State {
    rooms: [{
        value?: string, 
        label?: string, rooms:{value?:string, label?:string}[], title?:string }],
    title: string,
    algorithm: string,
    showbot: string,
}

export class DropDown extends React.Component <Props, State>{
    constructor (props) {
        super()
        this.state = {
          rooms: null,
          title: null,
          algorithm: null,
          showbot: 'hidden',
        }
    }

    /*
    static propTypes = {
       dropDownType: PropTypes.string,
    }
    */

    handleRoomsTitleChange (rooms, title) {
        this.setState({ 
            rooms: rooms,
            title: title,
            showbot: 'visible',
         });
    }

    render () {
            let dropDownStyle:any;
            if (this.props.orientation == 'microbit') {
                dropDownStyle = {
                    position: 'relative',
                    display: 'flex',
                    //margin: 'auto',
                }
            } 
            return (
                <div className='dropdown' style={dropDownStyle}> 
                    <TopDrop 
                        dropDownType={this.props.dropDownType} 
                        handleRoomsTitleChange={this.handleRoomsTitleChange.bind(this)}
                        orientation={this.props.orientation}
                    />
                    <BotDrop 
                        rooms={this.state.rooms} 
                        title={this.state.title} 
                        showbot={this.state.showbot}
                        dropDownType={this.props.dropDownType} 
                        handleSelection={this.props.handleSelection}
                        orientation={this.props.orientation}
                        />
                </div>
            ); 
    }
}