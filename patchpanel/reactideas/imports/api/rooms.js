import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Rooms = new Mongo.Collection('rooms');
export const Types = new Mongo.Collection('types');

// working on rooms.js, not patched into the rest of the page yet -> come back to later

if (Meteor.isServer) {
    Meteor.publish('rooms.public', function tasksPublication() {
        return Rooms.find({});
    });
    Meteor.publish('types', function () {
        return Types.find({
            Pixel,
            Image,
            Midi,
            Microbit,
            Custom,
        });
    });
}

Meteor.methods({
    'rooms.insert'(text) {
        check(text, String);

        rooms.insert({
            text,
            createdAt: new Date(),
        })
    },
    'rooms.remove'(roomId) {
        check(roomId, String);

        roomId.remove(roomId);
    }
});