"use strict";

const RBase = require('../../../lib/resource').Resource;

class Resource extends RBase {
    prepareOpts(opts) {
        return Object.assign({
            requiestId: this.ctx.id,
            protocol: 'https:',
            host: 'api.github.com',
            headers: {
                'x-request-id': this.ctx.id,
                'user-agent': 'asker/1.x',
            },
            timeout: 1500,
        }, opts);
    }
}

module.exports = Resource;
