'use strict';

var vow = require('vow');
var ask = require('vow-asker');
var Context = require('../context').Context;

class Resource {
    constructor(ctx, params) {
        this.ctx = new Context(ctx);
        this.params = params || { name: this.ctx.id };
        this.name = this.params.name;
    }

    invoke(method, args) {
        if (typeof this[method] !== 'function') {
            return vow.reject(new Error(`no method <${method}> found in ${this.name}`));
        }
        return vow.invoke(this[method], args, this);
    }

    get(opts) {
        return this.makeRequest(this.prepareRequestOpts(opts))
            .then(this.processResponse, this);
    }

    prepareRequestOpts(opts) {
        return opts;
    }

    makeRequest(opts) {
        this.ctx.start();
        console.log(`request <${this.params.name}> ${this.ctx.id} for [${opts.method || "GET"}]`);

        return ask(opts).always(function(result) {
            this.ctx.stop();
            console.log(`resolved request <${this.params.name}> ${this.ctx.id} [in 0~0 ms] for [${opts.method || "GET"}]`);

            return vow.cast(result);
        }, this);
    }

    processResponse(response) {
        return parseJsonResp(response.data.toString());
    }
}

function parseJsonResp(data) {
    try {
        return vow.resolve(JSON.parse(data));
    } catch (e) {
        return vow.reject(e);
    }
}

module.exports = Resource;
