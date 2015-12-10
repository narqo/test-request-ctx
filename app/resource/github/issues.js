"use strict";

var RGithub = require('../github');

class Resource extends RGithub {
    prepareOpts(opts) {
        return super.prepareOpts({ path: `/repos/${opts.org}/${opts.repo}/issues` });
    }
}

module.exports = Resource;
