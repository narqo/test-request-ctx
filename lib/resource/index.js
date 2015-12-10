"use strict";

var vow = require('vow');
var ask = require('vow-asker');
var Context = require('../context').Context;

class Resource {
    constructor(ctx, params) {
        this.ctx = new Context(ctx);
        this.params = params || { name: this.ctx.id };
    }

    get(opts) {
        return this.doRequest(this.prepareOpts(opts));
    }

    doRequest(opts) {
        this.ctx.start();
        console.log(`request <${this.params.name}> ${this.ctx.id} for [${opts.method || "GET"}]`);

        return ask(opts).always(function(result) {
            this.ctx.stop();
            console.log(`resolved request <${this.params.name}> ${this.ctx.id} [in 0~0 ms] for [${opts.method || "GET"}]`);

            return vow.cast(result);
        }, this);
    }

    prepareOpts(opts) {
        return opts;
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
        var rs = new cls(ctx, Object.assign({ name: name }, params));
        return rs.get(opts).then(rs.processResponse, rs);
    });
};

exports.Resource = Resource;
