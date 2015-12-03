"use strict"

var uuid = require('node-uuid');

function generateId() {
    return uuid.v1();
}

class Context {
    constructor(parent) {
        this._ended = false;

        this.id = generateId();
        this.parentId = parent ? parent.id : 0;
        this.parent = parent;

        this.children = [];
        if (parent) parent.children.push(this);

        this.records = new Map();
    }

    start() {
        if (this._ended) return;

        let time = process.hrtime();
        this.records.set(this.id, { time : time });
    }

    stop() {
        let time = this.records.get(this.id).time;
        let diff = process.hrtime(time);
        console.log('context: %s, parent: %s, time: %d', this.id, this.parentId, diff[0] * 1e9 + diff[1]);
    }
}

exports.Context = Context;
