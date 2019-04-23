import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import { App } from '../imports/ui/App.jsx';

Meteor.startup(() => {
    render(<App/>, document.getElementById('render-target'));
});