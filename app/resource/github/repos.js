"use strict";

var RGithub = require('../github');

class Resource extends RGithub {
    prepareOpts(opts) {
        return super.prepareOpts({ path: `/users/${opts.org}/repos` });
    }
}

module.exports = Resource;
