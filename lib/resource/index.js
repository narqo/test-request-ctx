"use strict"

var vow = require('vow');
var ask = require('vow-asker');
var Context = require('../context').Context;

class Resource {
    constructor(ctx, params) {
        this.ctx = new Context(ctx);
        this.params = params || {};
    }

    get(opts) {
        return this.doRequest(opts);
    }

    doRequest(opts) {
        this.ctx.start();
        return ask(opts).always(function(result) {
            this.ctx.stop();
            return vow.cast(result);
        }, this);
    }

    processResponse(response) {
        return parseJsonResp(response.data.toString());
    }
}

function loadResource(name) {
    try {
        return vow.resolve(require('../../app/resource/' + name));
    } catch (e) {
        throw vow.reject(e);
    }
}

function parseJsonResp(data) {
    try {
        return vow.resolve(JSON.parse(data));
    } catch (e) {
        return vow.reject(e);
    }
}

exports = module.exports = function resource(ctx, name, opts, params) {
    if (typeof ctx === 'string') {
        params = opts;
        opts = name;
        name = ctx;
        ctx = null;
    }

    return loadResource(name).then(cls => {
        var rs = new cls(ctx, params);
        return rs.get(opts).then(rs.processResponse, rs);
    });
};

exports.Resource = Resource;
