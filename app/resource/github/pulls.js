"use strict";

var RGithub = require('../github');

class Resource extends RGithub {
    prepareOpts(opts) {
        return super.prepareOpts({ path: `/repos/${opts.org}/${opts.repo}/pulls` });
    }
}

module.exports = Resource;
